package main

import (
	"log"
	"net/http"
	"os"
//	"math/rand"
//	"strconv"
//	"time"

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

	// TABLE TICKET
	models.CreateTicketTable()

	// TABLE POST
	models.CreatePostTable()
	/*p := &models.Post{ Mac: "00:B0:D0:63:C2:26", Serial: "6007041" }
	models.NewPost(p)
	p = &models.Post{ Mac: "D6:C2:12:45:A4:B8", Serial: "984653484", Seat: "bess-f1r6s4", ClusterID: 1 }
	models.NewPost(p)
	p = &models.Post{ Mac: "A4:D2:24:79:C1:D3", Serial: "84664815", Seat: "bess-f4r3s11", ClusterID: 4 }
	models.NewPost(p)*/
	/*rand.Seed(time.Now().UnixNano())
	for i := 0; i < 10; i++ {
		const bytesMac = "0123456789ABCDEF"
		mac := make([]byte, 17)
    	for j := range mac {
			if j % 3 == 2 { mac[j] = ':'; continue }
        	mac[j] = bytesMac[rand.Intn(len(bytesMac))]
    	}
		
		serial := strconv.Itoa(rand.Intn(1000000000 - 1000000) + 1000000)

		ifSeat := rand.Intn(2)
		seat := ""
		clusterID := 0
		if ifSeat == 1 {
			seat = "something"
			clusterID = rand.Intn(12 - 1) + 1
		}

		p := &models.Post{ Mac: string(mac), Serial: serial, Seat: seat, ClusterID: clusterID }
		models.NewPost(p)
	}*/

	router := InitializeRouter()

	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}
