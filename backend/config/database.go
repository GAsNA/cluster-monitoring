package config

import (
	"database/sql"
	"context"
	"log"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/sqlitedialect"
)

var (
	ctx	= context.Background()
	db	*bun.DB
)

func	DatabaseInit() {
	// INIT DB
	host	:= os.Getenv("POSTGRES_HOST")
	user_pg	:= os.Getenv("POSTGRES_USER")
	password:= os.Getenv("POSTGRES_PASSWORD")
	dbname	:= os.Getenv("POSTGRES_DB")

	psqlconn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", host, user_pg, password, dbname)
	sqldb, err := sql.Open("postgres", psqlconn)
	if err != nil { log.Fatal(err) }

	if err = sqldb.Ping(); err != nil { log.Fatal(err) }	

	// GET BUN DB
	db = bun.NewDB(sqldb, sqlitedialect.New())

	log.Println("The database is connected")
}

func	DB() *bun.DB {
	return db
}

func	Ctx() context.Context {
	return ctx
}
