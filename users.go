package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

const SESSION_COOKIE_NAME = "utsa-place-session"
const SESSION_AUTH = "auth"

type UserData struct {
	Email          string    `json:"email"`
	Password       string    `json:"password"`
	AccountCreated time.Time `json:"account-created"`
	LastLogin      time.Time `json:"last-login"`
}

// Handles requests to /login.html
func (s *Server) handle_login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		http.ServeFile(w, r, "./static/register.html")
	case http.MethodPost:
		// Get data from form
		email := r.FormValue("email")
		password := r.FormValue("password")
		// Get user from database
		user, ok := s.Users[email]
		// If user does not exist
		if !ok {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		// If password does not match
		if password != user.Password {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		// Generate session
		session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME)
		if err != nil {
			s.handle_logout(w, r)
			http.Error(w, "Invalid session", http.StatusUnauthorized)
			return
		}
		session.Values[SESSION_AUTH] = true
		session.Save(r, w)
		// Update last-login on DB
		user.LastLogin = time.Now()
		s.Users[email] = user
		// Redirect to index.html
		http.Redirect(w, r, "/", http.StatusFound)
	default:
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

// Handles requests to /register.html
func (s *Server) handle_register(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		http.ServeFile(w, r, "./static/register.html")
	case http.MethodPost:
		// Get data from form
		email := r.FormValue("email")
		password := r.FormValue("password")
		fmt.Println(r.Form)
		// Check that this email is not already registered
		if _, ok := s.Users[email]; ok {
			fmt.Println("Already registered")
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		// Generate session
		session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME)
		// If session cookie invalid
		if err != nil {
			s.handle_logout(w, r)
			http.Error(w, "Invalid session", http.StatusUnauthorized)
			return
		}
		// Save user information to DB
		s.Users[email] = UserData{
			Email:          email,
			Password:       password,
			AccountCreated: time.Now(),
			LastLogin:      time.Now(),
		}
		// Make session valid
		session.Values[SESSION_AUTH] = true
		// Send session token to browser
		session.Save(r, w)
		// Redirect to index.html
		s.save_state()
		http.Redirect(w, r, "/", http.StatusFound)
	default:
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func (s *Server) handle_logout(w http.ResponseWriter, r *http.Request) {
	// If session exists
	if session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME); err == nil {
		// Remove authorization
		session.Values[SESSION_AUTH] = false
		session.Save(r, w)
	}
	// Remove session cookie
	http.SetCookie(w, &http.Cookie{
		Name:   SESSION_COOKIE_NAME,
		MaxAge: -1,
	})
}

func (s *Server) save_state() {
	file, err := os.Create("db.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	json.NewEncoder(file).Encode(s.Users)
}
