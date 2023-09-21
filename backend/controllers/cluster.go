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

func ClustersIndex(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AllClusters())
}

func ClustersCreate(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	claims, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	// Check rights
	err = checkRights(&w, r, claims)
	if err != nil { return }

	body, err := ioutil.ReadAll(r.Body)
	if err != nil { log.Fatal(err) }

	var cluster models.Cluster

	err = json.Unmarshal(body, &cluster)
	if err != nil { log.Fatal(err) }

	models.NewCluster(&cluster)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersShow(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)
	
	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	cluster := models.FindClusterByID(id)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersUpdate(w http.ResponseWriter, r *http.Request) {
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

	cluster := models.FindClusterByID(id)
	
	err = json.Unmarshal(body, &cluster)

	models.UpdateCluster(cluster)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(cluster)
}

func ClustersDelete(w http.ResponseWriter, r *http.Request) {
	addHeader(&w)

	// Verification JWT and get claims
	_, err := verifyJwtAndClaims(&w, r)
	if err != nil { return }

	vars := mux.Vars(r)

	// strconv.Atoi is shorthand for ParseInt
	id, err := strconv.Atoi(vars["id"])
	if err != nil { log.Fatal(err) }

	w.WriteHeader(http.StatusOK)
	models.DeleteClusterByID(id)
}
