package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"strconv"
	"math"
  
	"main/models"
)

func TicketTypesIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get limit and page to return
	limit, page := getFilters(r.URL.Query())

	// How many element in DB
	count, err := models.CountAllTicketTypes()
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get ticket types
	ticketTypes, err := models.AllTicketTypes(limit, page)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticketTypes)
}

func TicketTypesCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Create ticket type
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	var ticketType models.TicketType
	err = json.Unmarshal(body, &ticketType)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	err = models.NewTicketType(&ticketType)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send back ticket type
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get ID of ticket type
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get ticket type
	ticketType, err := models.FindTicketTypeByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If ticket type not found
	if ticketType == nil { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesUpdate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of ticket type
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get ticket type
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	ticketType, err := models.FindTicketTypeByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If ticket type not found
	if ticketType == nil { w.WriteHeader(http.StatusNotFound); return }
	
	err = json.Unmarshal(body, &ticketType)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Update ticket type in DB
	nbRowsAffected, err := models.UpdateTicketType(ticketType)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesDelete(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of ticket type
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Delete ticket type in DB
	nbRowsAffected, err := models.DeleteTicketTypeByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
}
