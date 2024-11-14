package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type PixelData struct {
	X     int   `json:"x"`
	Y     int   `json:"y"`
	Color []int `json:"color"`
}

var pixelStore []PixelData

func savePixelHandler(w http.ResponseWriter, r *http.Request) {
	var pixel PixelData

	if err := json.NewDecoder(r.Body).Decode(&pixel); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pixelStore = append(pixelStore, pixel)
	log.Printf("Stored pixel: %+v", pixel)

	log.Printf("Current stored pixels: %+v", pixelStore)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(pixelStore); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
