# ThePlaceHolders
"UTSA Place" Collaborate website canvas that allows students to place a pixel
within a restricted amount of time to make art.

## How to run
1. Install [Go](https://go.dev/dl/)
2. Run the command `go run .` inside this folder
3. View the website at [127.0.0.1:8080](http://127.0.0.1:8080/)

## Backend Source
Our back-end is written in [Go](https://go.dev/) using the standard library.
* [Request handling](server.go)
* [User registration/login](users.go)

## Frontend Source
Our front-end is written in vanilla JavaScript, using the [Bootstrap](https://getbootstrap.com/)
CSS framework.
* [Main page](static/index.html)
* [Login page](static/login.html)
* [Registration page](static/register.html)
