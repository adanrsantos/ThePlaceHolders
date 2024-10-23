package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const SESSION_COOKIE_NAME = "utsa-place-session"
const SESSION_AUTH = "auth"
const SESSION_STARTED = "age"
const SESSION_CONFIRMED = "confirmed"
const SESSION_CONFIRM_KEY = "confirm-key"

const ENCRYPTION_STRENGTH = 14

type UserData struct {
	Email          string
	Password       string
	AccountCreated time.Time
	LastLogin      time.Time
}

func validate_email(email string) (string, bool) {
	email = strings.ToLower(email)
	regex := regexp.MustCompile("^[a-z]+.[a-z]+@(my.)?utsa.edu")
	ok := regex.MatchString(email)
	return email, ok
}

// Encrypts a password
func hash_password(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), ENCRYPTION_STRENGTH)
	return string(bytes)
}

// Compares an unencrpyted password to an encrypted password
func check_password_hash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Handles requests to /login.html
func (s *Server) handle_login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		http.ServeFile(w, r, "./static/login.html")
	case http.MethodPost:
		// Get data from form
		email := r.FormValue("email")
		password := r.FormValue("password")
		// Get user from database
		user, ok := s.Users[email]
		// If user does not exist
		if !ok {
			http.Error(w, "User not found", http.StatusForbidden)
			return
		}
		// If password does not match
		if !check_password_hash(password, user.Password) {
			http.Error(w, "Passwords dont match", http.StatusForbidden)
			return
		}
		// Generate session
		session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME)
		if err != nil {
			s.handle_logout(w, r)
			http.Error(w, "Invalid session", http.StatusUnauthorized)
			return
		}
		now := time.Now()
		session.Values[SESSION_AUTH] = true
		session.Values[SESSION_STARTED] = now.String()
		session.Save(r, w)
		// Update last-login on DB
		user.LastLogin = now
		s.Users[email] = user
		// Redirect to index.html
		fmt.Println("Logged in user: ", email)
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
		email, ok := validate_email(r.FormValue("email"))
		if !ok {
			http.Error(w, "Invalid email address", http.StatusForbidden)
			return
		}
		password := r.FormValue("password")
		if len(password) < 8 || len(password) >= 70 {
			http.Error(w, "Invalid password length", http.StatusForbidden)
			return
		}
		// Check that this email is not already registered
		if _, ok := s.Users[email]; ok {
			http.Error(w, "Already registered", http.StatusForbidden)
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
		now := time.Now()
		// Save user information to DB
		s.Users[email] = UserData{
			Email:          email,
			Password:       hash_password(password),
			AccountCreated: now,
			LastLogin:      now,
		}
		// Make session valid
		session.Values[SESSION_AUTH] = true
		session.Values[SESSION_STARTED] = now.String()
		session.Values[SESSION_CONFIRMED] = false
		// Send session token to browser
		session.Save(r, w)
		// Redirect to index.html
		fmt.Println("Registered user: ", email)
		http.Redirect(w, r, "/confirm-email", http.StatusFound)
	default:
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func (s *Server) handle_confirmation(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		session, err := s.Sessions.Get(r, SESSION_COOKIE_NAME)
		if err != nil {
			s.handle_logout(w, r)
			http.Redirect(w, r, "/register", http.StatusFound)
			return
		}
		confirmed := session.Values[SESSION_CONFIRMED]
		fmt.Println("Session confirmed: ", confirmed)
		http.ServeFile(w, r, "./static/confirmation.html")
	case http.MethodPost:
	default:
	}
}

func (s *Server) secret(w http.ResponseWriter, r *http.Request) {
	session, _ := s.Sessions.Get(r, SESSION_COOKIE_NAME)

	// Check if user is authenticated
	if auth, ok := session.Values[SESSION_AUTH].(bool); !ok || !auth {
		http.Error(w, "Not logged in", http.StatusForbidden)
		return
	}

	// Print secret message
	fmt.Fprintln(w, "Successfully logged in!")
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
		Name: SESSION_COOKIE_NAME,
		// Negative max age immediately removes the cookie
		MaxAge: -1,
	})
}
