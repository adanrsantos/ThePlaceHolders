package main

import (
	"crypto/tls"
	"fmt"
	"gopkg.in/gomail.v2"
	"net/smtp"
)

func Send(body string) {
	from := "xterminate18181@gmail.com"
	pass := "nvzp fodm ihzw gter"
	to := "joson.anthoney@frontdomain.org"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Hello there\n\n" +
		body

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		fmt.Printf("smtp error: %s", err)
		return
	}
	fmt.Println("Successfully sended to " + to)
}

func MailTest() {
	d := gomail.NewDialer("smtp.gmail.com", 587, "xterminate18181@gmail.com", "nvzp fodm ihzw gter")
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	m := gomail.NewMessage()
	m.SetHeader("From", "xterminate18181@gmail.com")
	m.SetHeader("To", "logan@gatlintc.com")
	m.SetHeader("Subject", "Confirm Email")
	m.SetBody("text/html", "Test body")
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
}
