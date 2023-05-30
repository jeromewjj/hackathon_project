package main

import (
	"transactions/database"
	"transactions/server"
)

func main() {
	database.DB = database.InitializeDatabase()
	server.Start()
}
