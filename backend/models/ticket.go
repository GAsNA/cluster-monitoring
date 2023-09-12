package models

import (
	"log"
	"time"
	"main/config"

	"github.com/uptrace/bun"
)

// MODEL
type Ticket struct {
	bun.BaseModel	`bun:"table:ticket"`

	ID				int			`bun:"id,pk,autoincrement,type:SERIAL"`
	Seat			string		`bun:"seat",notnull`
	Type			int			`bun:"type,notnull"`
	Comment			string		`bun:"comment"`
	AuthorID		int			`bun:"author_id",notnul`
	CreatedAt		time.Time	`bun:"created_at,notnull"`
	Resolved		bool		`bun:"resolved,notnull"`
	ResolvedAt		time.Time	`bun:"resolved_at"`
	ResolvedByID	int			`bun:"resolved_by_id"`
}

// CREATE TABLE
func CreateTicketTable() {
	_, err := config.DB().NewCreateTable().Model((*Ticket)(nil)).
					ForeignKey(`("author_id") REFERENCES "user" ("id") ON DELETE CASCADE`).
					ForeignKey(`("resolved_by_id") REFERENCES "user" ("id") ON DELETE CASCADE`).
					ForeignKey(`("type") REFERENCES "ticket_type" ("id") ON DELETE CASCADE`).
					IfNotExists().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

// ACTIONS
func NewTicket(t *Ticket) {
	if t == nil { return }

	t.CreatedAt = time.Now();

	_, err := config.DB().NewInsert().Model(t).
					Ignore().
					Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Select
func FindTicketByID(id int) *Ticket {
	var tickets	[]Ticket
	err := config.DB().NewSelect().Model(&tickets).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	if len(tickets) == 0 { log.Println("FindTicketByID: no ticket found"); return (*Ticket)(nil) }
	return &tickets[0]
}

func AllTickets() []Ticket {
	var tickets	[]Ticket
	err := config.DB().NewSelect().Model(&tickets).
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return tickets
}

func AllTicketsOfSeat(seat string) []Ticket {
	var tickets []Ticket
	err := config.DB().NewSelect().Model(&tickets).
				Where("seat = ?", seat).
				Order("created_at DESC").
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return tickets
}

	// Update
func UpdateTicket(t *Ticket) {
	if t == nil { return }

	_, err := config.DB().NewUpdate().Model(t).
				Where("id = ?", t.ID).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}

	// Delete
func DeleteTicketByID(id int) {
	_, err := config.DB().NewDelete().Model((*Ticket)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { log.Fatal(err) }
}
