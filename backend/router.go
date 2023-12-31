package main

import (
	"github.com/gorilla/mux"
	"main/controllers"
)

func InitializeRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	/* ROUTES USED */
		// AUTH
	router.Methods("GET", "OPTIONS").Path("/auth/me").HandlerFunc(controllers.Me)
	router.Methods("GET", "OPTIONS").Path("/auth/login").HandlerFunc(controllers.Login)
	router.Methods("GET", "OPTIONS").Path("/auth/logout").HandlerFunc(controllers.Logout)
	router.Methods("GET", "OPTIONS").Path("/auth/anonymisation").HandlerFunc(controllers.Anonymisation)

		// TICKETTYPES
	router.Methods("GET", "OPTIONS").Path("/tickettypes").HandlerFunc(controllers.TicketTypesIndex)
	router.Methods("POST", "OPTIONS").Path("/tickettypes").HandlerFunc(controllers.TicketTypesCreate)
	router.Methods("PUT", "OPTIONS").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesUpdate)
	router.Methods("DELETE", "OPTIONS").Path("/tickettypes/{id}").HandlerFunc(controllers.TicketTypesDelete)

		// TICKETS
	router.Methods("GET", "OPTIONS").Path("/tickets").HandlerFunc(controllers.TicketsIndex)
	router.Methods("POST", "OPTIONS").Path("/tickets").HandlerFunc(controllers.TicketsCreate)
	router.Methods("PUT", "OPTIONS").Path("/tickets/{id}").HandlerFunc(controllers.TicketsUpdate)
	router.Methods("DELETE", "OPTIONS").Path("/tickets/{id}").HandlerFunc(controllers.TicketsDelete)

		// CLUSTERS
	router.Methods("GET", "OPTIONS").Path("/clusters").HandlerFunc(controllers.ClustersIndex)
	router.Methods("POST", "OPTIONS").Path("/clusters").HandlerFunc(controllers.ClustersCreate)
	router.Methods("PUT", "OPTIONS").Path("/clusters/{id}").HandlerFunc(controllers.ClustersUpdate)
	router.Methods("DELETE", "OPTIONS").Path("/clusters/{id}").HandlerFunc(controllers.ClustersDelete)

		// POSTS
	router.Methods("GET", "OPTIONS").Path("/posts").HandlerFunc(controllers.PostsIndex)
	router.Methods("POST", "OPTIONS").Path("/posts").HandlerFunc(controllers.PostsCreate)
	router.Methods("PUT", "OPTIONS").Path("/posts/{id}").HandlerFunc(controllers.PostsUpdate)
	router.Methods("DELETE", "OPTIONS").Path("/posts/{id}").HandlerFunc(controllers.PostsDelete)

	/* POSSIBLE ROUTES */
		// USERS
//	router.Methods("GET").Path("/users").HandlerFunc(controllers.UsersIndex)
//	router.Methods("POST").Path("/users").HandlerFunc(controllers.UsersCreate)
//	router.Methods("GET").Path("/users/{id}").HandlerFunc(controllers.UsersShow)
//	router.Methods("PUT").Path("/users/{id}").HandlerFunc(controllers.UsersUpdate)
//	router.Methods("DELETE").Path("/users/{id}").HandlerFunc(controllers.UsersDelete)

		// TICKETTYPES
//	router.Methods("GET").Path("/ticketypes/{id}").HandlerFunc(controllers.TicketTypesShow)

		// TICKETS
//	router.Methods("GET").Path("/tickets/{id}").HandlerFunc(controllers.TicketsShow)

		// CLUSTERS
//	router.Methods("GET").Path("/clusters/{id}").HandlerFunc(controllers.ClustersShow)

		// POSTS
//	router.Methods("GET").Path("/posts/{id}").HandlerFunc(controllers.PostsShow)

	return router
}
