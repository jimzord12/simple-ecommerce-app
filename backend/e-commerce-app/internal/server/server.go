package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jimzord12/simple-ecommerce-app/backend/e-commerce-app/internal/database"
	_ "github.com/joho/godotenv/autoload"
)

type Server struct {
	port int

	db database.Service
}

func NewServer() (*http.Server, database.Service) {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	NewServer := &Server{
		port: port,
		db:   database.New(),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server, NewServer.db
}
