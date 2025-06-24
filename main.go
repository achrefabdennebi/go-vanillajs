package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"frontendmasters.com/movies/data"
	"frontendmasters.com/movies/handlers"
	"frontendmasters.com/movies/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movies.log")
	logInstance.Error("Hello From Error", nil)

	if err != nil {
		log.Fatalf("Failed to initilize logger %v", err)
	}

	defer logInstance.Close()
	return logInstance
}

func main() {
	// log initializer
	logInstance := initializeLogger()
	// Environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("No .env file was available")
	}

	// Connect to the database
	dbConntStr := os.Getenv("DATABASE_URL")

	if dbConntStr == "" {
		log.Fatal("DATABASE_URL not")
	}

	db, err := sql.Open("postgres", dbConntStr)

	if err != nil {
		log.Fatalf("Failed to connect to the DB %v", err)
	}

	defer db.Close()

	// Initialize data repository for movies
	movieRepo, err := data.NewMovieRepository(db, logInstance)

	if err != nil {
		log.Fatal("Failed to initialize repository")
	}

	// Movie hanlder initalizer
	movieHandler := handlers.NewMovieHandler(movieRepo, logInstance)

	http.HandleFunc("/api/movies/top/", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random/", movieHandler.GetRandomMovies)
	http.HandleFunc("/api/movies/search/", movieHandler.SearchMovies)
	http.HandleFunc("/api/movies/", movieHandler.GetMovie) // api/movies/123
	http.HandleFunc("/api/genres/", movieHandler.GetGenres)

	// Handle for static files
	http.Handle("/", http.FileServer(http.Dir("public")))
	fmt.Println("Serving files")

	addr := ":8080"
	err2 := http.ListenAndServe(addr, nil)
	if err2 != nil {
		log.Fatalf("Server failed: %v", err)
		logInstance.Error("Server failed", err)
	}
}
