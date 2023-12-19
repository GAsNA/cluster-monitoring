package models

import (
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type Post struct {
	bun.BaseModel	`bun:"table:post"`

	ID			int		`bun:"id,pk,autoincrement,type:SERIAL"`
	Mac			string	`bun:"mac_address,notnull"`
	Serial		string	`bun:"serial_number,notnull"`
	Seat		string	`bun:"seat,nullzero"`
	ClusterID	int		`bun:"cluster_id,nullzero"`
}

// CREATE TABLE
func CreatePostTable() error {
	_, err := config.DB().NewCreateTable().Model((*Post)(nil)).
					ForeignKey(`("cluster_id") REFERENCES "cluster" ("id") ON DELETE CASCADE`).
					IfNotExists().
					Exec(config.Ctx())
	return err
}

// ACTIONS
func NewPost(p *Post) error {
	if p == nil { return nil }

	_, err := config.DB().NewInsert().Model(p).
					Ignore().
					Exec(config.Ctx())
	return err
}

	// Select
func CountAllPosts(mac, serial string) (int, error) {
	subquery := config.DB().NewSelect().Model((*Post)(nil))

	if mac != "" {
		subquery.Where("LOWER(mac_address) LIKE LOWER(?)", "%" + mac + "%")
	}
	if serial != "" {
		subquery.Where("LOWER(serial_number) LIKE LOWER(?)", "%" + serial + "%")
	}
	
	count, err := subquery.Count(config.Ctx())

	return count, err
}

func FindPostByID(id int) (*Post, error) {
	posts := []Post{}
	err := config.DB().NewSelect().Model(&posts).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*Post)(nil), err }

	if len(posts) == 0 { return (*Post)(nil), nil }
	return &posts[0], nil
}

func AllPosts(limit, page int, mac, serial string) ([]Post, error) {
	posts := []Post{}

	subquery := config.DB().NewSelect().Model(&posts)

	if mac != "" {
		subquery.Where("LOWER(mac_address) LIKE LOWER(?)", "%" + mac + "%")
	}
	if serial != "" {
		subquery.Where("LOWER(serial_number) LIKE LOWER(?)", "%" + serial + "%")
	}

	err := subquery.Limit(limit).
			Offset((page - 1) * limit).
			Scan(config.Ctx())

	return posts, err
}

	// Update
func UpdatePost(p *Post) (int64, error) {
	if p == nil { return 0, nil }

	res, err := config.DB().NewUpdate().Model(p).
				Where("id = ?", p.ID).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}

	// Delete
func DeletePostByID(id int) (int64, error) {
	res, err := config.DB().NewDelete().Model((*Post)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}
