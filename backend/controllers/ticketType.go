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

func TicketTypesIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllTicketTypes())
}

func TicketTypesCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var ticketType models.TicketType

	err = json.Unmarshal(body, &ticketType)
	if err != nil { log.Fatal(err) }

	models.NewTicketType(&ticketType)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	ticketType := models.FindTicketTypeByID(id)

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

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err)}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	ticketType := models.FindTicketTypeByID(id)
	
	err = json.Unmarshal(body, &ticketType)

	models.UpdateTicketType(ticketType)

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

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	w.WriteHeader(http.StatusOK)
	models.DeleteTicketTypeByID(id)
}
