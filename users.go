package main

import (
	"net/http"
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

func (s *Server) handle_login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
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
		http.Error(w, "Internal Error", http.StatusInternalServerError)
		return
	}
	session.Values[SESSION_AUTH] = true
	if err := session.Save(r, w); err != nil {
		http.Error(w, "Internal Error", http.StatusInternalServerError)
		return
	}
	// Update last-login on DB
	user.LastLogin = time.Now()
	s.Users[email] = user
	// Redirect to index.html
	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *Server) handle_register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	// Get data from form
	email := r.FormValue("email")
	password := r.FormValue("password")
	// Check that this email is not already registered
	if _, ok := s.Users[email]; ok {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	// Generate session
	session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME)
	if err != nil {
		http.Error(w, "Internal Error", http.StatusInternalServerError)
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
	if err := session.Save(r, w); err != nil {
		http.Error(w, "Internal Error", http.StatusInternalServerError)
		return
	}
	// Redirect to index.html
	http.Redirect(w, r, "/", http.StatusFound)
}
