package models

import (
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

type ClusterWithTicketsWithTypeAndAuthor struct {
	Cluster `bun:",extend"`

	Tickets	[]TicketWithTypeAndAuthor	`bun:"tickets"`
}

// CREATE TABLE
func CreateClusterTable() error {
	_, err := config.DB().NewCreateTable().Model((*Cluster)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	return err
}

// ACTIONS
func NewCluster(c *Cluster) error {
	if c == nil { return nil }

	_, err := config.DB().NewInsert().Model(c).
					Ignore().
					Exec(config.Ctx())
	return err
}

	// Select
func CountAllClusters() (int, error) {
	count, err := config.DB().NewSelect().Model((*Cluster)(nil)).Count(config.Ctx())
	return count, err
}

func FindClusterByID(id int) (*Cluster, error) {
	clusters := []Cluster{}
	err := config.DB().NewSelect().Model(&clusters).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*Cluster)(nil), err }

	if len(clusters) == 0 { return (*Cluster)(nil), nil }
	return &clusters[0], nil
}

func AllClusters(limit, page int) ([]Cluster, error) {
	clusters := []Cluster{}

	err := config.DB().NewSelect().Model(&clusters).
				Limit(limit).
				Offset((page - 1) * limit).
				Scan(config.Ctx())

	return clusters, err
}

/*func AllClustersWithTickets() []ClusterWithTickets {
	var clusters	[]ClusterWithTickets
	err := config.DB().NewSelect().Model(&clusters).
				ColumnExpr("cluster.*").
				ColumnExpr("json_agg(json_build_object('ID', t.id, 'Seat', t.seat, 'ClusterID', t.cluster_id, 'TypeID', t.type_id, 'Comment', t.comment, 'AuthorID', t.author_id, 'CreatedAt', t.created_at, 'Resolved', t.resolved, 'ResolvedAt', t.resolved_at, 'ResolvedByID', t.resolved_by_id)) AS tickets").
				Join("LEFT JOIN ticket AS t ON t.cluster_id = cluster.id").
				Group("cluster.id").
				Order("cluster.id ASC").
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return clusters

}*/

	// Update
func UpdateCluster(c *Cluster) (int64, error) {
	if c == nil { return 0, nil }

	res, err := config.DB().NewUpdate().Model(c).
				Where("id = ?", c.ID).
				Exec(config.Ctx())
	if err != nil { return 0, err }
	
	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}

	// Delete
func DeleteClusterByID(id int) (int64, error) {
	res, err := config.DB().NewDelete().Model((*Cluster)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}
