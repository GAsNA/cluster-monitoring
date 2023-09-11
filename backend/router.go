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
	router.Methods("POST").Path("/auth/login").HandlerFunc(controllers.Login)
	router.Methods("POST").Path("/auth/logout").HandlerFunc(controllers.Logout)

	// TICKETTYPES
	router.Methods("GET").Path("/tickettypes").HandlerFunc(controllers.TicketTypesIndex)
	router.Methods("POST").Path("/tickettypes").HandlerFunc(controllers.TicketTypesCreate)
	router.Methods("GET").Path("/ticketypes/{id}").HandlerFunc(controllers.TicketTypesShow)
	router.Methods("PUT").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesUpdate)
	router.Methods("DELETE").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesDelete)

	// TICKETS
	router.Methods("GET").Path("/tickets").HandlerFunc(controllers.TicketsIndex)
	router.Methods("POST").Path("/tickets").HandlerFunc(controllers.TicketsCreate)
	router.Methods("GET").Path("/tickes/{id}").HandlerFunc(controllers.TicketsShow)
	router.Methods("PUT").Path("/tickets/{id}").HandlerFunc(controllers.TicketsUpdate)
	router.Methods("DELETE").Path("/tickets/{id}").HandlerFunc(controllers.TicketsDelete)

	return router
}
