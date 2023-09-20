package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
  
	"main/models"
)

func TicketsIndex(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllTickets())
}

func TicketsIndexBySeat(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	seat := vars["id"]

	limit := r.URL.Query().Get("limit")

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllTicketsOfSeat(seat, limit))
}

func TicketsCreate(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)
	
	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Create ticket
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var ticket models.Ticket
	err = json.Unmarshal(body, &ticket)
	if err != nil { log.Fatal(err) }

	ticket.AuthorID = claims.User.ID

	models.NewTicket(&ticket)

	// Send back ticket
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket)
}

func TicketsShow(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	ticket := models.FindTicketByID(id)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket)
}

func TicketsUpdate(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err)}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	ticket := models.FindTicketByID(id)
	
	err = json.Unmarshal(body, &ticket)

	models.UpdateTicket(ticket)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket)
}

func TicketsDelete(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	w.WriteHeader(http.StatusOK)
	models.DeleteTicketByID(id)
}
