package models

import (
	"log"
	"time"
	"strconv"
	"main/config"

	"github.com/uptrace/bun"
)

// MODELS
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

type TicketWithType struct {
	Ticket `bun:",extend"`

	TicketTypeName	string		`bun:"ticket_type__name"`
}

type TicketWithTypeAndAuthor struct {
	Ticket `bun:",extend"`

	TicketTypeName	string		`bun:"ticket_type__name"`
	AuthorLogin		string		`bun:"author__login"`
	AuthorImage		string		`bun:"author__image"`
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
	t.ResolvedByID = t.AuthorID;

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

func AllTickets() []TicketWithTypeAndAuthor {
	var tickets	[]TicketWithTypeAndAuthor
	err := config.DB().NewSelect().Model(&tickets).
				ColumnExpr("ticket.*").
				ColumnExpr("tt.name AS ticket_type__name").
				ColumnExpr("a.login AS author__login, a.image AS author__image").
				Join("JOIN ticket_type AS tt ON tt.id = ticket.type").
				Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id").
				Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return tickets
}

func AllTicketsOfSeatWithTypeAndAuthor(seat, limit string) []TicketWithTypeAndAuthor {
	var tickets []TicketWithTypeAndAuthor

	subquery := config.DB().NewSelect().Model(&tickets).
					Where("seat = ?", seat).
					ColumnExpr("ticket.*").
					ColumnExpr("tt.name AS ticket_type__name").
					ColumnExpr("a.login AS author__login, a.image AS author__image").
					Join("JOIN ticket_type AS tt ON tt.id = ticket.type").
					Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id").
					Order("ticket.created_at DESC")
	
	limit_int, err := strconv.Atoi(limit)
	if err == nil { subquery = subquery.Limit(limit_int) }

	err = subquery.Scan(config.Ctx())
	if err != nil { log.Fatal(err) }

	return tickets
}

func AllTicketsOfSeatWithType(seat, limit string) []TicketWithType {
	var tickets []TicketWithType

	subquery := config.DB().NewSelect().Model(&tickets).
					Where("seat = ?", seat).
					ColumnExpr("ticket.*").
					ColumnExpr("tt.name AS ticket_type__name").
					Join("JOIN ticket_type AS tt ON tt.id = ticket.type").
					Order("ticket.created_at DESC")
	
	limit_int, err := strconv.Atoi(limit)
	if err == nil { subquery = subquery.Limit(limit_int) }

	err = subquery.Scan(config.Ctx())
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
