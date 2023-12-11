package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
	"math"
  
	"main/models"
)

func TicketsIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get limit and page to return
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil { limit = 30 }
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil { page = 1 }

	// How many element in DB
	count := models.CountAllTickets()

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))
	
	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllTickets(limit, page))
}

func TicketsIndexBySeat(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

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
	addHeadersCommon(&w)
	
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
	addHeadersCommon(&w)

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
	addHeadersCommon(&w)

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
	addHeadersCommon(&w)

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
