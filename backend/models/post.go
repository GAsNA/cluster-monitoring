package models

import (
	"log"
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type Post struct {
	bun.BaseModel	`bun:"table:post"`

	ID			int		`bun:"id,pk,autoincrement,type:SERIAL"`
	Mac			string	`bun:"mac_address,notnull"`
	Serial		string	`bun:"serial_number,notnull"`
	Seat		string	`bun:"seat"`
	ClusterID	int		`bun:"cluster_id"`
}

// CREATE TABLE
func CreatePostTable() {
	_, err := config.DB().NewCreateTable().Model((*Post)(nil)).
					ForeignKey(`("cluster_id") REFERENCES "cluster" ("id") ON DELETE CASCADE`).
					IfNotExists().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

// ACTIONS
func NewPost(c *Post) {
	if c == nil { return }

	_, err := config.DB().NewInsert().Model(c).
					Ignore().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Select
func FindPostByID(id int) *Post {
	var posts	[]Post
	err := config.DB().NewSelect().Model(&posts).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(posts) == 0 { log.Println("FindPostByID: no post found"); return (*Post)(nil) }
	return &posts[0]
}

func AllPosts() []Post {
	var posts	[]Post
	err := config.DB().NewSelect().Model(&posts).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return posts
}

	// Update
func UpdatePost(c *Post) {
	if c == nil { return }

	_, err := config.DB().NewUpdate().Model(c).
				Where("id = ?", c.ID).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Delete
func DeletePostByID(id int) {
	_, err := config.DB().NewDelete().Model((*Post)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}
