package models

import (
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type User struct {
	bun.BaseModel	`bun:"table:user"`

	ID		int		`bun:"id,pk,autoincrement,notnull,type:SERIAL"`
	IDIntra	int		`bun:"id_intra,notnull"`
	Login	string	`bun:"login,notnull"`
	Image	string	`bun:"image,notnull"`
	IsStaff	bool	`bun:"is_staff,notnull"`
}

// CREATE TABLE
func CreateUserTable() error {
	_, err := config.DB().NewCreateTable().Model((*User)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	return err
}

// ACTIONS
func NewUser(u *User) error {
	if u == nil { return nil }

	_, err := config.DB().NewInsert().Model(u).
					Ignore().
					Exec(config.Ctx())
	return err
}

	// Select
func CountAllUsers() (int, error) {
	count, err := config.DB().NewSelect().Model((*User)(nil)).Count(config.Ctx())
	return count, err
}

func FindUserByID(id int) (*User, error) {
	users := []User{}
	err := config.DB().NewSelect().Model(&users).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*User)(nil), err }

	if len(users) == 0 { return (*User)(nil), nil }
	return &users[0], nil
}

func FindUserByIDIntra(id int) (*User, error) {
	users := []User{}
	err := config.DB().NewSelect().Model(&users).
				Where("id_intra = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*User)(nil), err }

	if len(users) == 0 { return (*User)(nil), nil }
	return &users[0], nil
}

func FindUserByLogin(login string) (*User, error) {
	users := []User{}
	err := config.DB().NewSelect().Model(&users).
				Where("login = ?", login).
				Scan(config.Ctx())
	if err != nil { return (*User)(nil), err }

	if len(users) == 0 { return (*User)(nil), nil }
	return &users[0], nil
}

func AllUsers(limit, page int) ([]User, error) {
	users := []User{}
	err := config.DB().NewSelect().Model(&users).
				Limit(limit).
				Offset((page - 1) * limit).
				Scan(config.Ctx())

	return users, err
}

	// Update
func UpdateUser(u *User) (int64, error) {
	if u == nil { return 0, nil }

	res, err := config.DB().NewUpdate().Model(u).
				Where("id = ?", u.ID).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}

	// Delete
func DeleteUserByID(id int) (int64, error) {
	res, err := config.DB().NewDelete().Model((*User)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}
