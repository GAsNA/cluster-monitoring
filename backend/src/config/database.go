package config

import (
	"database/sql"
	"context"

	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/sqlitedialect"
)

var (
	ctx	= context.Background()
	db	*bun.DB
)

func	GetEnvVar(key string) string {
	return os.Getenv(key)
}

func	DatabaseInit() {
	// INIT DB
	host	:= GetEnvVar("POSTGRES_HOST")
	user_pg	:= GetEnvVar("POSTGRES_USER")
	password:= GetEnvVar("POSTGRES_PASSWORD")
	dbname	:= GetEnvVar("POSTGRES_DB")

	psqlconn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", host, user_pg, password, dbname)
	sqldb, err := sql.Open("postgres", psqlconn)
	if err != nil { log.Fatal(err) }

	if err = sqldb.Ping(); err != nil { log.Fatal(err) }	

	// GET BUN DB
	db = bun.NewDB(sqldb, sqlitedialect.New())

	log.Println("The database is connected")

	// Create Table users if not exists
	createUsersTable()
}

func	createUsersTable() {
	_, err := db.NewCreateTable().Model((*User)(nil)).IfNotExists().Exec(ctx)
	if err != nil { log.Fatal(err) }
}

// Getter for db var
func	Db() *sql.DB {
	return db
}
