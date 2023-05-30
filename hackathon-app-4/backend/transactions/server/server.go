package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

var port = os.Getenv("PORT")

func Start() {
	fmt.Println("=== HTTP Transactions server ===")

	if port == "" {
		port = "8080"
	}

	IntializeHandlers()
	fmt.Println("Listening on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
