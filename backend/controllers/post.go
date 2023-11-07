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

func PostsIndex(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllPosts())
}

func PostsCreate(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)
	
	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Create post
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil { log.Fatal(err) }

	models.NewPost(&post)

	// Send back post
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsShow(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	post := models.FindPostByID(id)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsUpdate(w http.ResponseWriter, r *http.Request) {
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

	post := models.FindPostByID(id)

	err = json.Unmarshal(body, &post)
	if err != nil { log.Fatal(err) }
	
	models.UpdatePost(post)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsDelete(w http.ResponseWriter, r *http.Request) {
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
	models.DeletePostByID(id)
}
