package models

import (
	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel	`bun:"table:user"`

	ID		int64	`bun:"id,pk,autoincrement,type:SERIAL"`
	Login	string	`bun:"login,notnull"`
}

type Users	[]User
