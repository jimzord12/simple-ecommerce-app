package main

import (
	"fmt"

	"github.com/jimzord12/simple-ecommerce-app/backend/e-commerce-app/internal/server"
)

func main() {
	fmt.Println("Initializing server and database connection...")

	server, db := server.NewServer()

	// Perform a Heath check with the DB
	fmt.Println("Performing database health check...")
	healthCheck := db.Health()
	fmt.Println("PostgreSQL DB - State:", healthCheck["message"])

	fmt.Println("Starting the server...")
	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
