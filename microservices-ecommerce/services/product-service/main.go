package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

var storageServiceURL = getStorageServiceURL()

func getStorageServiceURL() string {
	url := os.Getenv("STORAGE_SERVICE_URL")

	if url == "" {
		return "http://localhost:8004"
	}

	return url
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS",
		)
		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type",
		)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	response := map[string]string{
		"status":  "UP",
		"service": "product-service",
	}

	json.NewEncoder(w).Encode(response)
}

func getProductsFromStorage() ([]Product, error) {

	url := storageServiceURL + "/api/storage/products"

	log.Printf("Calling Storage Service: %s", url)

	response, err := http.Get(url)

	if err != nil {
		log.Printf("HTTP request failed: %v", err)
		return nil, err
	}

	defer response.Body.Close()

	log.Printf(
		"Storage Service returned HTTP status: %d",
		response.StatusCode,
	)

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(
			"storage service returned status %d",
			response.StatusCode,
		)
	}

	var products []Product

	err = json.NewDecoder(response.Body).Decode(&products)

	if err != nil {
		log.Printf(
			"Failed to decode Storage Service response: %v",
			err,
		)
		return nil, err
	}

	log.Printf(
		"Successfully received %d products",
		len(products),
	)

	return products, nil
}

func getProductFromStorage(id int) (*Product, error) {

	url := fmt.Sprintf(
		"%s/api/storage/products/%d",
		storageServiceURL,
		id,
	)

	log.Printf("Calling Storage Service: %s", url)

	response, err := http.Get(url)

	if err != nil {
		log.Printf("HTTP request failed: %v", err)
		return nil, err
	}

	defer response.Body.Close()

	log.Printf(
		"Storage Service returned HTTP status: %d",
		response.StatusCode,
	)

	if response.StatusCode == http.StatusNotFound {
		return nil, nil
	}

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf(
			"storage service returned status %d",
			response.StatusCode,
		)
	}

	var product Product

	err = json.NewDecoder(response.Body).Decode(&product)

	if err != nil {
		log.Printf(
			"Failed to decode Storage Service response: %v",
			err,
		)
		return nil, err
	}

	log.Printf(
		"Successfully received product ID %d",
		id,
	)

	return &product, nil
}

func productsHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	if r.URL.Path == "/api/products" {

		products, err := getProductsFromStorage()

		if err != nil {

			log.Printf(
				"Failed to get products from Storage Service: %v",
				err,
			)

			http.Error(
				w,
				"Storage service unavailable",
				http.StatusServiceUnavailable,
			)

			return
		}

		json.NewEncoder(w).Encode(products)
		return
	}

	idString := strings.TrimPrefix(
		r.URL.Path,
		"/api/products/",
	)

	id, err := strconv.Atoi(idString)

	if err != nil {

		http.Error(
			w,
			"Invalid product ID",
			http.StatusBadRequest,
		)

		return
	}

	product, err := getProductFromStorage(id)

	if err != nil {

		log.Printf(
			"Failed to get product %d from Storage Service: %v",
			id,
			err,
		)

		http.Error(
			w,
			"Storage service unavailable",
			http.StatusServiceUnavailable,
		)

		return
	}

	if product == nil {

		http.Error(
			w,
			"Product not found",
			http.StatusNotFound,
		)

		return
	}

	json.NewEncoder(w).Encode(product)
}

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/products", productsHandler)
	mux.HandleFunc("/api/products/", productsHandler)

	handler := enableCORS(mux)

	fmt.Println("Product Service running on port 8002")
	fmt.Println("Storage Service:", storageServiceURL)

	log.Fatal(
		http.ListenAndServe(":8002", handler),
	)
}