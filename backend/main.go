package main

import (
	"log"
	"net/http"
	"os"

	"main/config"
	"main/models"
)

func main() {
	config.DatabaseInit()

	// TABLE USER
	models.CreateUserTable()

	// TABLE TICKET TYPE
	models.CreateTicketTypeTable()
	tt := &models.TicketType{ Name: "Fan" }
	models.NewTicketType(tt)
	tt = &models.TicketType{ Name: "Internet" }
	models.NewTicketType(tt)
	tt = &models.TicketType{ Name: "Screen" }
	models.NewTicketType(tt)
	tt = &models.TicketType{ Name: "Mouse" }
	models.NewTicketType(tt)
	tt = &models.TicketType{ Name: "Keyboard" }
	models.NewTicketType(tt)
	tt = &models.TicketType{ Name: "Other" }
	models.NewTicketType(tt)

	router := InitializeRouter()

	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}
