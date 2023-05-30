package main

import (
	"instruments/database"
	"instruments/server"
)

func main() {
	database.DB = database.InitializeDatabase()
	server.Start()
}
