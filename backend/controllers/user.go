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

func UsersIndex(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllUsers())
}

func UsersCreate(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var user models.User

	err = json.Unmarshal(body, &user)
	if err != nil { log.Fatal(err) }

	models.NewUser(&user)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersShow(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	user := models.FindUserByID(id)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersUpdate(w http.ResponseWriter, r *http.Request) {
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

	user := models.FindUserByID(id)
	
	err = json.Unmarshal(body, &user)

	models.UpdateUser(user)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersDelete(w http.ResponseWriter, r *http.Request) {
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
	models.DeleteUserByID(id)
}
