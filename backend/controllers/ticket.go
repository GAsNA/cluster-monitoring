package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
  
	"main/models"
)

func TicketsIndex(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllTickets())
}

func TicketsIndexBySeat(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	seat := vars["id"]

	limit := r.URL.Query().Get("limit")

	w.WriteHeader(http.StatusOK)
	
	if claims.User.IsStaff {
		json.NewEncoder(w).Encode(models.AllTicketsOfSeatWithTypeAndAuthor(seat, limit))
	} else {
		json.NewEncoder(w).Encode(models.AllTicketsOfSeatWithType(seat, limit))
	}
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
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err)}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	ticket := models.FindTicketByID(id)
	lastStatusResolved := ticket.Resolved

	err = json.Unmarshal(body, &ticket)
	if err != nil { log.Fatal(err) }
	
	// If ticket is passed from unresolved to resolved
	if lastStatusResolved == false && ticket.Resolved == true {
		ticket.ResolvedAt = time.Now();
		ticket.ResolvedByID = claims.User.ID
	// Else if ticket is passed from resolved to unresolved
	} else if lastStatusResolved == true && ticket.Resolved == false {
		ticket.ResolvedAt = time.Time{};
		ticket.ResolvedByID = ticket.AuthorID
	}

	models.UpdateTicket(ticket)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket)
}

func TicketsDelete(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	w.WriteHeader(http.StatusOK)
	models.DeleteTicketByID(id)
}
