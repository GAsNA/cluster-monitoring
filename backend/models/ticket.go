package models

import (
	"time"
	"main/config"

	"github.com/uptrace/bun"
)

// MODELS
type Ticket struct {
	bun.BaseModel	`bun:"table:ticket"`

	ID				int			`bun:"id,pk,autoincrement,type:SERIAL"`
	Seat			string		`bun:"seat,notnull"`
	ClusterID		int			`bun:"cluster_id,notnull"`
	TypeID			int			`bun:"type_id,notnull"`
	Comment			string		`bun:"comment"`
	AuthorID		int			`bun:"author_id",notnull`
	CreatedAt		time.Time	`bun:"created_at,notnull,type:timestamptz"`
	Resolved		bool		`bun:"resolved,notnull"`
	ResolvedAt		time.Time	`bun:"resolved_at,type:timestamptz"`
	ResolvedByID	int			`bun:"resolved_by_id"`
}

type TicketWithType struct {
	Ticket `bun:",extend"`

	TicketTypeName	string		`bun:"ticket_type__name"`
}

type TicketWithTypeAndAuthor struct {
	Ticket `bun:",extend"`

	TicketTypeName	string		`bun:"ticket_type__name"`
	AuthorIDIntra	string		`bun:"author__id_intra"`
	AuthorLogin		string		`bun:"author__login"`
	AuthorImage		string		`bun:"author__image"`
}

// CREATE TABLE
func CreateTicketTable() error {
	_, err := config.DB().NewCreateTable().Model((*Ticket)(nil)).
					ForeignKey(`("author_id") REFERENCES "user" ("id") ON DELETE CASCADE`).
					ForeignKey(`("resolved_by_id") REFERENCES "user" ("id") ON DELETE CASCADE`).
					ForeignKey(`("cluster_id") REFERENCES "cluster" ("id") ON DELETE CASCADE`).
					ForeignKey(`("type_id") REFERENCES "ticket_type" ("id") ON DELETE CASCADE`).
					IfNotExists().
					Exec(config.Ctx())
	return err
}

// ACTIONS
func NewTicket(t *Ticket) (Ticket, error) {
	if t == nil { return *(*Ticket)(nil), nil }

	t.CreatedAt = time.Now();
	t.ResolvedByID = t.AuthorID;

	_, err := config.DB().NewInsert().Model(t).
					Ignore().
					Exec(config.Ctx())	

	return *t, err
}

	// Select
func CountAllTickets() (int, error) {
	count, err := config.DB().NewSelect().Model((*Ticket)(nil)).Count(config.Ctx())

	return count, err
}

func FindTicketByID(id int) (*Ticket, error) {
	tickets := []Ticket{}
	err := config.DB().NewSelect().Model(&tickets).
				Where("id = ?", id).
				Scan(config.Ctx())
	if err != nil { return (*Ticket)(nil), err }

	if len(tickets) == 0 { return (*Ticket)(nil), nil }
	return &tickets[0], nil
}

func AllTickets(limit, page int) ([]TicketWithTypeAndAuthor, error) {
	tickets := []TicketWithTypeAndAuthor{}

	err := config.DB().NewSelect().Model(&tickets).
				ColumnExpr("ticket.*").
				ColumnExpr("tt.name AS ticket_type__name").
				ColumnExpr("a.id_intra AS author__id_intra, a.login AS author__login, a.image AS author__image").
				Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id").
				Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id").
				Order("ticket.created_at DESC").
				Limit(limit).
				Offset((page - 1) * limit).
				Scan(config.Ctx())

	return tickets, err
}

func AllTicketsOfSeatWithTypeAndAuthor(seat string, limit, page int) ([]TicketWithTypeAndAuthor, error) {
	tickets := []TicketWithTypeAndAuthor{}

	err := config.DB().NewSelect().Model(&tickets).
					Where("seat = ?", seat).
					ColumnExpr("ticket.*").
					ColumnExpr("tt.name AS ticket_type__name").
					ColumnExpr("a.id_intra AS author__id_intra, a.login AS author__login, a.image AS author__image").
					Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id").
					Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id").
					Order("ticket.created_at DESC").
					Limit(limit).
					Offset((page - 1) * limit).
					Scan(config.Ctx())

	return tickets, err
}

func AllTicketsOfSeatWithType(seat string, limit, page int) ([]TicketWithType, error) {
	tickets := []TicketWithType{}

	err := config.DB().NewSelect().Model(&tickets).
					Where("seat = ?", seat).
					ColumnExpr("ticket.*").
					ColumnExpr("tt.name AS ticket_type__name").
					Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id").
					Order("ticket.created_at DESC").
					Limit(limit).
					Offset((page - 1) * limit).
					Scan(config.Ctx())

	return tickets, err
}

	// Update
func UpdateTicket(t *Ticket) (Ticket, error) {
	if t == nil { return *(*Ticket)(nil), nil }

	_, err := config.DB().NewUpdate().Model(t).
				Where("id = ?", t.ID).
				Exec(config.Ctx())
	
	return *t, err
}

	// Delete
func DeleteTicketByID(id int) (int64, error) {
	res, err := config.DB().NewDelete().Model((*Ticket)(nil)).
				Where("id = ?", id).
				Exec(config.Ctx())
	if err != nil { return 0, err }
	
	nbRowsAffected, err := res.RowsAffected()
	
	return nbRowsAffected, err
}
