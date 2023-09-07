package models

import (
	"log"
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type User struct {
	bun.BaseModel	`bun:"table:user"`

	ID		int		`bun:"id,pk,autoincrement,type:SERIAL"`
	Login	string	`bun:"login,notnull"`
}

// CREATE TABLE
func CreateUserTable() {
	_, err := config.DB().NewCreateTable().Model((*User)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

// ACTIONS
func NewUser(u *User) {
	if u == nil { return }

	_, err := config.DB().NewInsert().Model(u).
					Ignore().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Select
func FindUserByID(id int) *User {
	var users	[]User
	err := config.DB().NewSelect().Model(&users).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(users) == 0 { log.Println("FindUserByID: no user found"); return (*User)(nil) }
	return &users[0]
}

func FindUserByLogin(login string) *User {
	var users	[]User
	err := config.DB().NewSelect().Model(&users).
				Where("login = ?", login).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(users) == 0 { log.Println("FindUserByLogin: no user found"); return (*User)(nil) }
	return &users[0]
}

func AllUsers() []User {
	var users	[]User
	err := config.DB().NewSelect().Model(&users).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return users
}

	// Update
func UpdateUser(u *User) {
	if u == nil { return }

	_, err := config.DB().NewUpdate().Model(u).
				Where("id = ?", u.ID).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Delete
func DeleteUserByID(id int) {
	_, err := config.DB().NewDelete().Model((*User)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}
