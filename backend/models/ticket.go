package models

import (
	"time"
	"strings"
	"strconv"
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
func NewTicket(t *Ticket) error {
	if t == nil { return nil }

	t.CreatedAt = time.Now();
	t.ResolvedByID = t.AuthorID;

	_, err := config.DB().NewInsert().Model(t).
					Ignore().
					Exec(config.Ctx())	

	return err
}

	// Select
func CountAllTickets(seat, author, resolved, ticketType string) (int, error) {
	subquery := config.DB().NewSelect().Model((*Ticket)(nil)).
				ColumnExpr("ticket.*").
				ColumnExpr("tt.name AS ticket_type__name").
				ColumnExpr("a.id_intra AS author__id_intra, a.login AS author__login, a.image AS author__image").
				Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id").
				Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id")

	if seat != "" {
		subquery = subquery.Where("seat = ?", seat)
	}
	if author != "" {
		subquery = subquery.Where("a.login LIKE ?", "%" + author + "%")
	}
	resolved_bool, err := strconv.ParseBool(resolved)
	if err == nil {
		subquery = subquery.Where("resolved = ?", resolved_bool)
	}
	if ticketType != "" {
		subquery = subquery.Where("tt.name = ?", ticketType)
	}

	count, err := subquery.Count(config.Ctx()) 

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

func AllTicketsWithTypeAndAuthor(limit, page int, seat, author, resolved, ticketType, order string) ([]TicketWithTypeAndAuthor, error) {
	tickets := []TicketWithTypeAndAuthor{}

	subquery := config.DB().NewSelect().Model(&tickets).
				ColumnExpr("ticket.*").
				ColumnExpr("tt.name AS ticket_type__name").
				ColumnExpr("a.id_intra AS author__id_intra, a.login AS author__login, a.image AS author__image").
				Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id").
				Join("JOIN public.\"user\" AS a ON a.id = ticket.author_id")

	if seat != "" {
		subquery = subquery.Where("LOWER(seat) LIKE LOWER(?)", "%" + seat + "%")
	}
	if author != "" {
		subquery = subquery.Where("LOWER(a.login) LIKE LOWER(?)", "%" + author + "%")
	}
	resolved_bool, err := strconv.ParseBool(resolved)
	if err == nil {
		subquery = subquery.Where("resolved = ?", resolved_bool)
	}
	if ticketType != "" {
		subquery = subquery.Where("LOWER(tt.name) = LOWER(?)", ticketType)
	}
	if strings.ToLower(order) == "asc" || strings.ToLower(order) == "desc" {
		subquery = subquery.Order("ticket.created_at " + order)
	}
	
	err = subquery.Limit(limit).
			Offset((page - 1) * limit).
			Scan(config.Ctx())

	return tickets, err
}

func AllTicketsWithType(limit, page int, seat, author, resolved, ticketType, order string) ([]TicketWithType, error) {
	tickets := []TicketWithType{}

	subquery := config.DB().NewSelect().Model(&tickets).
				ColumnExpr("ticket.*").
				ColumnExpr("tt.name AS ticket_type__name").
				Join("JOIN ticket_type AS tt ON tt.id = ticket.type_id")

	if seat != "" {
		subquery = subquery.Where("LOWER(seat) LIKE LOWER(?)", "%" + seat + "%")
	}
	if author != "" {
		subquery = subquery.Where("LOWER(a.login) LIKE LOWER(?)", "%" + author + "%")
	}
	resolved_bool, err := strconv.ParseBool(resolved)
	if err == nil {
		subquery = subquery.Where("resolved = ?", resolved_bool)
	}
	if ticketType != "" {
		subquery = subquery.Where("LOWER(tt.name) = LOWER(?)", ticketType)
	}
	if strings.ToLower(order) == "asc" || strings.ToLower(order) == "desc" {
		subquery = subquery.Order("ticket.created_at " + order)
	}
	
	err = subquery.Limit(limit).
			Offset((page - 1) * limit).
			Scan(config.Ctx())

	return tickets, err
}

	// Update
func UpdateTicket(t *Ticket) (int64, error) {
	if t == nil { return 0, nil }

	res, err := config.DB().NewUpdate().Model(t).
				Where("id = ?", t.ID).
				Exec(config.Ctx())
	if err != nil { return 0, err }
	
	nbRowsAffected, err := res.RowsAffected()
	return nbRowsAffected, err
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
