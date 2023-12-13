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

func UsersIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get limit and page to return
	limit, page := getFilters(r.URL.Query())

	// How many element in DB
	count, err := models.CountAllUsers()
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get users
	users, err := models.AllUsers(limit, page)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func UsersCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Create user
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	var user models.User
	err = json.Unmarshal(body, &user)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	err = models.NewUser(&user)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send back user
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get ID of user
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	user, err := models.FindUserByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If user not found
	if user == nil { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersUpdate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }
	
	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of user
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get user
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	user, err := models.FindUserByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If user not found
	if user == nil { w.WriteHeader(http.StatusNotFound); return }
	
	err = json.Unmarshal(body, &user)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Update user in DB
	nbRowsAffected, err := models.UpdateUser(user)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func UsersDelete(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of cluster
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Delete user in DB
	nbRowsAffected, err := models.DeleteUserByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
}
