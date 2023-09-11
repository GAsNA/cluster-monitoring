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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(models.AllTickets())
}

func TicketsCreate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var ticket models.Ticket

	err = json.Unmarshal(body, &ticket)
	if err != nil { log.Fatal(err) }

	models.NewTicket(&ticket)

	json.NewEncoder(w).Encode(ticket)
}

func TicketsShow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	ticket := models.FindTicketByID(id)

	json.NewEncoder(w).Encode(ticket)
}

func TicketsUpdate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err)}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	ticket := models.FindTicketByID(id)
	
	err = json.Unmarshal(body, &ticket)

	models.UpdateTicket(ticket)

	json.NewEncoder(w).Encode(ticket)
}

func TicketsDelete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	models.DeleteTicketByID(id)
}
