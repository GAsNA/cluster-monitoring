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
	router.Methods("GET", "OPTIONS").Path("/auth/me").HandlerFunc(controllers.Me)
	router.Methods("GET").Path("/auth/login").HandlerFunc(controllers.Login)
	router.Methods("POST", "OPTIONS").Path("/auth/logout").HandlerFunc(controllers.Logout)

	// TICKETTYPES
	router.Methods("GET", "OPTIONS").Path("/tickettypes").HandlerFunc(controllers.TicketTypesIndex)
	router.Methods("POST").Path("/tickettypes").HandlerFunc(controllers.TicketTypesCreate)
	router.Methods("GET").Path("/ticketypes/{id}").HandlerFunc(controllers.TicketTypesShow)
	router.Methods("PUT").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesUpdate)
	router.Methods("DELETE").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesDelete)

	// TICKETS
	router.Methods("GET").Path("/tickets").HandlerFunc(controllers.TicketsIndex)
	router.Methods("POST", "OPTIONS").Path("/tickets").HandlerFunc(controllers.TicketsCreate)
	router.Methods("GET").Path("/tickes/{id}").HandlerFunc(controllers.TicketsShow)
	router.Methods("PUT", "OPTIONS").Path("/tickets/{id}").HandlerFunc(controllers.TicketsUpdate)
	router.Methods("DELETE").Path("/tickets/{id}").HandlerFunc(controllers.TicketsDelete)
	router.Methods("GET", "OPTIONS").Path("/tickets/seat/{id}").HandlerFunc(controllers.TicketsIndexBySeat)

	// CLUSTERS
	router.Methods("GET", "OPTIONS").Path("/clusters").HandlerFunc(controllers.ClustersIndex)
	router.Methods("POST").Path("/clusters").HandlerFunc(controllers.ClustersCreate)
	router.Methods("GET").Path("/clusters/{id}").HandlerFunc(controllers.ClustersShow)
	router.Methods("PUT").Path("/clusters/{id}").HandlerFunc(controllers.ClustersUpdate)
	router.Methods("DELETE").Path("/clusters/{id}").HandlerFunc(controllers.ClustersDelete)

	return router
}
