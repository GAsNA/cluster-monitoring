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
	/*tt := &models.TicketType{ Name: "Fan" }
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
	models.NewTicketType(tt)*/

	// TABLE TICKET
	models.CreateTicketTable()

	// TABLE CLUSTER
	models.CreateClusterTable()
	/*c := &models.Cluster{ Name: "Bess-f1", Link: "https://cdn.intra.42.fr/cluster/image/182/BESS-f1.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Bess-f2", Link: "https://cdn.intra.42.fr/cluster/image/183/BESS-f2.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Bess-f3", Link: "https://cdn.intra.42.fr/cluster/image/184/BESS-f3.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Bess-f4", Link: "https://cdn.intra.42.fr/cluster/image/185/BESS-f4.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Paul-f3", Link: "https://cdn.intra.42.fr/cluster/image/201/PAUL-f3.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Paul-f4", Link: "https://cdn.intra.42.fr/cluster/image/202/PAUL-f4.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Paul-f5", Link: "https://cdn.intra.42.fr/cluster/image/203/PAUL-f5.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Made-f0A", Link: "https://cdn.intra.42.fr/cluster/image/228/MADE-f0A.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Made-f0B", Link: "https://cdn.intra.42.fr/cluster/image/229/MADE-f0B.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Made-f0C", Link: "https://cdn.intra.42.fr/cluster/image/230/MADE-f0C.svg" }
	models.NewCluster(c)
	c = &models.Cluster{ Name: "Made-f0D", Link: "https://cdn.intra.42.fr/cluster/image/231/MADE-f0D.svg" }
	models.NewCluster(c)*/

	router := InitializeRouter()

	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}
