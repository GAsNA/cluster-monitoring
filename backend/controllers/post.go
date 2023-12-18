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

func PostsIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get limit and page to return
	query := r.URL.Query()
	limit, page := getFiltersCommon(query)
	mac := query.Get("mac")
	serial := query.Get("serial")

	// How many element in DB
	count, err := models.CountAllPosts(mac, serial)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get posts
	posts, err := models.AllPosts(limit, page, mac, serial)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))
	
	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func PostsCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Create post
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	err = models.NewPost(&post)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send back post
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of post
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get post
	post, err := models.FindPostByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If post not found
	if post == nil { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsUpdate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of post
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get post
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	post, err := models.FindPostByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If post not found
	if post == nil { w.WriteHeader(http.StatusNotFound); return }

	err = json.Unmarshal(body, &post)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }
	
	// Update post in DB
	nbRowsAffected, err := models.UpdatePost(post)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

func PostsDelete(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Get ID of post
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Delete post in DB
	nbRowsAffected, err := models.DeletePostByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
}
