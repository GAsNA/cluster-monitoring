package models

import (
	"log"
	"main/config"

	"github.com/uptrace/bun"
)

// MODELS
type Cluster struct {
	bun.BaseModel	`bun:"table:cluster"`

	ID		int		`bun:"id,pk,autoincrement,notnull,type:SERIAL"`
	Name	string	`bun:"name,notnull"`
	Link	string	`bun:"link,notnull"`
}

type ClusterWithTickets struct {
	Cluster `bun:",extend"`

	Tickets	[]Ticket	`bun:"tickets"`
}

// CREATE TABLE
func CreateClusterTable() {
	_, err := config.DB().NewCreateTable().Model((*Cluster)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

// ACTIONS
func NewCluster(c *Cluster) {
	if c == nil { return }

	_, err := config.DB().NewInsert().Model(c).
					Ignore().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Select
func FindClusterByID(id int) *Cluster {
	var clusters	[]Cluster
	err := config.DB().NewSelect().Model(&clusters).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(clusters) == 0 { log.Println("FindClusterByID: no cluster found"); return (*Cluster)(nil) }
	return &clusters[0]
}

func AllClusters() []Cluster {
	var clusters	[]Cluster
	err := config.DB().NewSelect().Model(&clusters).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return clusters
}

func AllClustersWithTickets() []ClusterWithTickets {
	var clusters	[]ClusterWithTickets
	err := config.DB().NewSelect().Model(&clusters).
				ColumnExpr("cluster.*").
				ColumnExpr("t AS tickets").
				Join("JOIN ticket AS t ON t.cluster_id = cluster.ID").
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return clusters
}

	// Update
func UpdateCluster(c *Cluster) {
	if c == nil { return }

	_, err := config.DB().NewUpdate().Model(c).
				Where("id = ?", c.ID).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Delete
func DeleteClusterByID(id int) {
	_, err := config.DB().NewDelete().Model((*Cluster)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}
