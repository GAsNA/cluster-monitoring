package models

import (
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type TicketType struct {
	bun.BaseModel	`bun:"table:ticket_type"`

	ID		int		`bun:"id,pk,autoincrement,type:SERIAL"`
	Name	string	`bun:"name,notnull"`
}

// CREATE TABLE
func CreateTicketTypeTable() error {
	_, err := config.DB().NewCreateTable().Model((*TicketType)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	return err
}

// ACTIONS
func NewTicketType(tt *TicketType) error {
	if tt == nil { return nil }

	_, err := config.DB().NewInsert().Model(tt).
					Ignore().
					Exec(config.Ctx())
	return err
}

	// Select
func CountAllTicketTypes() (int, error) {
	count, err := config.DB().NewSelect().Model((*TicketType)(nil)).Count(config.Ctx())
	return count, err
}

func FindTicketTypeByID(id int) (*TicketType, error) {
	ticketTypes := []TicketType{}
	err := config.DB().NewSelect().Model(&ticketTypes).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*TicketType)(nil), err }

	if len(ticketTypes) == 0 { return (*TicketType)(nil), nil }
	return &ticketTypes[0], nil
}

func FindTicketTypeByName(name string) (*TicketType, error) {
	ticketTypes := []TicketType{}
	err := config.DB().NewSelect().Model(&ticketTypes).
				Where("name = ?", name).
				Scan(config.Ctx())
	if err != nil { return (*TicketType)(nil), err }

	if len(ticketTypes) == 0 { return (*TicketType)(nil), nil }
	return &ticketTypes[0], nil
}

func AllTicketTypes(limit, page int) ([]TicketType, error) {
	ticketTypes := []TicketType{}
	err := config.DB().NewSelect().Model(&ticketTypes).
				Limit(limit).
				Offset((page - 1) * limit).
				Scan(config.Ctx())

	return ticketTypes, err
}

	// Update
func UpdateTicketType(tt *TicketType) (int64, error) {
	if tt == nil { return 0, nil }

	res, err := config.DB().NewUpdate().Model(tt).
				Where("id = ?", tt.ID).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}

	// Delete
func DeleteTicketTypeByID(id int) (int64, error) {
	res, err := config.DB().NewDelete().Model((*TicketType)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { return 0, err }

	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
}
