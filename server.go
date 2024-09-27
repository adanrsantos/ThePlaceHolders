package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
)

const ADDRESS = "127.0.0.1"
const PORT = "8080"

type Server struct {
	Users    map[string]UserData
	Sessions *sessions.CookieStore
}

func main() {
	// Create server object
	secret := []byte("super-secret-key")
	server := Server{
		Users:    make(map[string]UserData),
		Sessions: sessions.NewCookieStore(secret),
	}
	// Host static files
	static_files := http.FileServer(http.Dir("static/"))
	http.Handle("/", static_files)
	// Redirect .html to clean URL
	http.Handle("/register.html", http.RedirectHandler("/register", 301))
	http.Handle("/login.html", http.RedirectHandler("/login", 301))
	// Handle user authentication
	http.HandleFunc("/register", server.handle_register)
	http.HandleFunc("/login", server.handle_login)
	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		server.handle_logout(w, r)
		http.Redirect(w, r, "/", http.StatusFound)
	})
	// Start web server at 127.0.0.1:8080
	fmt.Printf("Listening to %s on port %s...\n", ADDRESS, PORT)
	e := http.ListenAndServe(ADDRESS+":"+PORT, nil)
	// Print any errors
	if e != nil {
		fmt.Println("Error starting server:")
		log.Fatal(e)
	}
}
