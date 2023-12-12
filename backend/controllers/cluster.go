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

func ClustersIndex(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get limit and page to return
	limit, page := getFilters(r.URL.Query())

	// How many element in DB
	count, err := models.CountAllClusters()
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get clusters
	clusters, err := models.AllClusters(limit, page)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Add necessary headers
	addHeadersGet(&w, strconv.Itoa(count), strconv.Itoa(page),
		strconv.Itoa(int(math.Ceil(float64(count) / float64(limit)))), strconv.Itoa(limit))

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(clusters)
}

func ClustersCreate(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	// Create cluster
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	var cluster models.Cluster
	err = json.Unmarshal(body, &cluster)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	err = models.NewCluster(&cluster)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Send back cluster
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersShow(w http.ResponseWriter, r *http.Request) {
	addHeadersCommon(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Get ID of cluster
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Get cluster
	cluster, err := models.FindClusterByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If cluster not found
	if cluster == nil { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersUpdate(w http.ResponseWriter, r *http.Request) {
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

	// Get cluster
	body, err := ioutil.ReadAll(r.Body)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	cluster, err := models.FindClusterByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	if cluster == nil { w.WriteHeader(http.StatusNotFound); return }
	
	err = json.Unmarshal(body, &cluster)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// Update cluster in DB
	nbRowsAffected, err := models.UpdateCluster(cluster)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersDelete(w http.ResponseWriter, r *http.Request) {
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

	// Delete cluster in DB
	nbRowsAffected, err := models.DeleteClusterByID(id)
	if err != nil { w.WriteHeader(http.StatusInternalServerError); return }

	// If no row affected
	if nbRowsAffected == 0 { w.WriteHeader(http.StatusNotFound); return }

	// Send result
	w.WriteHeader(http.StatusOK)
}
