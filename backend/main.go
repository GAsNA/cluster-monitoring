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
	models.CreateUserTable()

	router := InitializeRouter()

	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}
