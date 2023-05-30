package main

import (
	"investments/database"
	"investments/server"
)

func main() {
	database.DB = database.InitializeDatabase()
	server.Start()
}
