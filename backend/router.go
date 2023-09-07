package main

import (
	"github.com/gorilla/mux"
	"main/controllers"
)

func InitializeRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	// USERS
	router.Methods("GET").Path("/users").HandlerFunc(controllers.UsersIndex)
	router.Methods("POST").Path("/users").HandlerFunc(controllers.UsersCreate)
	router.Methods("GET").Path("/users/{id}").HandlerFunc(controllers.UsersShow)
	router.Methods("PUT").Path("/users/{id}").HandlerFunc(controllers.UsersUpdate)
	router.Methods("DELETE").Path("/users/{id}").HandlerFunc(controllers.UsersDelete)

	// AUTH
	router.Methods("POST").Path("/auth").HandlerFunc(controllers.Login)

	return router
}
