package main

import (
	"hackathon-app-4/backend/market_values/database"
	"hackathon-app-4/backend/market_values/server"
)

func main() {
	database.DB = database.InitializeDatabase()
	server.Start()
}
