package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
)

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 1000

type Server struct {
	// Registered user information
	Users map[string]UserData
	// Login sessions
	Sessions *sessions.CookieStore
}

func main() {
	Send("test body")
	// Grab command line arguments
	ipFlag := flag.String("ip", "127.0.0.1", "IP address to receive traffic from")
	portFlag := flag.String("port", "8080", "Port to receive traffic from")
	flag.Parse()
	address := *ipFlag
	port := *portFlag
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
	http.HandleFunc("/secret", server.secret)
	http.HandleFunc("/confirm-email", server.handle_confirmation)
	// Start web server at 127.0.0.1:8080
	fmt.Printf("Listening to %s on port %s...\n", address, port)
	err := http.ListenAndServe(address+":"+port, nil)
	// Print any errors
	if err != nil {
		fmt.Println("Error starting server:")
		log.Fatal(err)
	}
}
