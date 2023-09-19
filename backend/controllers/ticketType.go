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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(models.AllTicketTypes())
}

func TicketTypesCreate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var ticketType models.TicketType

	err = json.Unmarshal(body, &ticketType)
	if err != nil { log.Fatal(err) }

	models.NewTicketType(&ticketType)

	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesShow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	ticketType := models.FindTicketTypeByID(id)

	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesUpdate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err)}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	ticketType := models.FindTicketTypeByID(id)
	
	err = json.Unmarshal(body, &ticketType)

	models.UpdateTicketType(ticketType)

	json.NewEncoder(w).Encode(ticketType)
}

func TicketTypesDelete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	models.DeleteTicketTypeByID(id)
}
