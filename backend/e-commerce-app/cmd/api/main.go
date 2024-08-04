package main

import (
	"fmt"

	"github.com/jimzord12/simple-ecommerce-app/backend/e-commerce-app/internal/server"
)

func main() {
	// database := os.Getenv("DB_DATABASE")
	// password := os.Getenv("DB_PASSWORD")
	// username := os.Getenv("DB_USERNAME")
	// port := os.Getenv("DB_PORT")
	// host := os.Getenv("DB_HOST")

	// connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, database)

	// fmt.Println("Connecting with:", connStr) // Log the connection string (without password for security)

	// db, err := sql.Open("postgres", connStr)
	// if err != nil {
	// 	log.Fatalf("Failed to open database connection: %v", err)
	// }

	// // Test the database connection
	// err = db.Ping()
	// if err != nil {
	// 	log.Fatalf("Failed to ping database: %v", err)
	// }

	// fmt.Println("Successfully connected to the database!")

	//////////////////////////////////////////////////

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
