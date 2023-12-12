package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
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
	count, err := models.CountAllTickets()
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get tickets
	tickets, err := models.AllTickets(limit, page)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))
	
	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tickets)
}

func TicketsIndexBySeat(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get seat
	vars := mux.Vars(r)
	seat := vars["id"]

	// Get limit and page
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil { limit = 30 }
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil { page = 1 }

	// How many element in DB

	// Get tickets
	var tickets interface{}
	if claims.User.IsStaff {
		tickets, err = models.AllTicketsOfSeatWithTypeAndAuthor(seat, limit, page)
	} else {
		tickets, err = models.AllTicketsOfSeatWithType(seat, limit, page)
	}
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(1), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(1 / float64(limit)))), strconv.Itoa(limit))

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tickets)
}

func TicketsCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Create ticket
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	var ticket models.Ticket
	err = json.Unmarshal(body, &ticket)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	ticket.AuthorID = claims.User.ID	

	ticket, err = models.NewTicket(&ticket)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send back ticket
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket)
}

func TicketsShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get ID of the ticket
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get ticket
	ticket, err := models.FindTicketByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send result
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

	// Get ID of the ticket
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get ticket
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	ticket, err := models.FindTicketByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	lastStatusResolved := ticket.Resolved

	err = json.Unmarshal(body, &ticket)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
	
	// If ticket is passed from unresolved to resolved
	if lastStatusResolved == false && ticket.Resolved == true {
		ticket.ResolvedAt = time.Now();
		ticket.ResolvedByID = claims.User.ID
	// Else if ticket is passed from resolved to unresolved
	} else if lastStatusResolved == true && ticket.Resolved == false {
		ticket.ResolvedAt = time.Time{};
		ticket.ResolvedByID = ticket.AuthorID
	}

	// Update ticket in DB
	ticket_ret, err := models.UpdateTicket(ticket)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticket_ret)
}

func TicketsDelete(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of the ticket
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Delete ticket in DB
	err = models.DeleteTicketByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send result
	w.WriteHeader(http.StatusOK)
}
