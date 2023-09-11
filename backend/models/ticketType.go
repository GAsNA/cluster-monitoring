package models

import (
	"log"
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
func CreateTicketTypeTable() {
	_, err := config.DB().NewCreateTable().Model((*TicketType)(nil)).
					IfNotExists().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

// ACTIONS
func NewTicketType(tt *TicketType) {
	if tt == nil { return }

	_, err := config.DB().NewInsert().Model(tt).
					Ignore().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Select
func FindTicketTypeByID(id int) *TicketType {
	var ticketTypes	[]TicketType
	err := config.DB().NewSelect().Model(&ticketTypes).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(ticketTypes) == 0 { log.Println("FindTicketTypeByID: no user found"); return (*TicketType)(nil) }
	return &ticketTypes[0]
}

func FindTicketTypeByName(name string) *TicketType {
	var ticketTypes	[]TicketType
	err := config.DB().NewSelect().Model(&ticketTypes).
				Where("name = ?", name).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(ticketTypes) == 0 { log.Println("FindTicketTypeByName: no ticket type found"); return (*TicketType)(nil) }
	return &ticketTypes[0]
}

func AllTicketTypes() []TicketType {
	var ticketTypes	[]TicketType
	err := config.DB().NewSelect().Model(&ticketTypes).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return ticketTypes
}

	// Update
func UpdateTicketType(tt *TicketType) {
	if tt == nil { return }

	_, err := config.DB().NewUpdate().Model(tt).
				Where("id = ?", tt.ID).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Delete
func DeleteTicketTypeByID(id int) {
	_, err := config.DB().NewDelete().Model((*TicketType)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}
