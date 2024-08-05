package server

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/jimzord12/simple-ecommerce-app/backend/e-commerce-app/internal/models"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jimzord12/simple-ecommerce-app/backend/e-commerce-app/internal/database"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// Product Routes
	r.Get("/api/products", GetProducts)
	r.Get("/api/products/{id}", GetProductByID)
	r.Post("/api/products", CreateProduct)
	r.Put("/api/products/{id}", UpdateProduct)
	r.Delete("/api/products/{id}", DeleteProduct)

	// Customer Routes
	r.Get("/api/customers", GetCustomers)
	r.Get("/api/customers/{id}", GetCustomerByID)
	r.Post("/api/customers", CreateCustomer)
	r.Put("/api/customers/{id}", UpdateCustomer)
	r.Delete("/api/customers/{id}", DeleteCustomer)

	// Order Routes
	r.Get("/api/orders", GetOrders)
	r.Get("/api/orders/{id}", GetOrderByID)
	r.Post("/api/orders", CreateOrder)
	r.Put("/api/orders/{id}", UpdateOrder)
	r.Delete("/api/orders/{id}", DeleteOrder)

	// Order Items Routes
	r.Get("/api/orders/{order_id}/items", GetOrderItems)
	r.Get("/api/orders/{order_id}/items/{id}", GetOrderItemByID)
	r.Post("/api/orders/{order_id}/items", CreateOrderItem)
	r.Put("/api/orders/{order_id}/items/{id}", UpdateOrderItem)
	r.Delete("/api/orders/{order_id}/items/{id}", DeleteOrderItem)

	//////// JWT ///////

	// // Public routes
	// r.Post("/api/login", Login)

	// // Protected routes
	// r.Group(func(r chi.Router) {
	// 	r.Use(authenticate)

	// 	// Product Routes
	// 	r.Get("/api/products", GetProducts)
	// 	r.Get("/api/products/{id}", GetProductByID)
	// 	r.Post("/api/products", CreateProduct)
	// 	r.Put("/api/products/{id}", UpdateProduct)
	// 	r.Delete("/api/products/{id}", DeleteProduct)

	// 	// Customer Routes
	// 	r.Get("/api/customers", GetCustomers)
	// 	r.Get("/api/customers/{id}", GetCustomerByID)
	// 	r.Post("/api/customers", CreateCustomer)
	// 	r.Put("/api/customers/{id}", UpdateCustomer)
	// 	r.Delete("/api/customers/{id}", DeleteCustomer)

	// 	// Order Routes
	// 	r.Get("/api/orders", GetOrders)
	// 	r.Get("/api/orders/{id}", GetOrderByID)
	// 	r.Post("/api/orders", CreateOrder)
	// 	r.Put("/api/orders/{id}", UpdateOrder)
	// 	r.Delete("/api/orders/{id}", DeleteOrder)

	// 	// Order Items Routes
	// 	r.Get("/api/orders/{order_id}/items", GetOrderItems)
	// 	r.Get("/api/orders/{order_id}/items/{id}", GetOrderItemByID)
	// 	r.Post("/api/orders/{order_id}/items", CreateOrderItem)
	// 	r.Put("/api/orders/{order_id}/items/{id}", UpdateOrderItem)
	// 	r.Delete("/api/orders/{order_id}/items/{id}", DeleteOrderItem)
	// })

	return r
}

// Model Types
type Product = models.Product
type Customer = models.Customer
type Order = models.Order
type OrderItem = models.OrderItem

type Service = database.Service

// Database Instance
var db *sql.DB = database.New().DB()

/// Product Handlers ///

// Tested with Bruno ✅
func GetProducts(w http.ResponseWriter, r *http.Request) {
	fmt.Println(db)

	rows, err := db.Query("SELECT product_id, product_name, description, category, price, stock_quantity FROM products")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Category, &p.Price, &p.Stock); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// Tested with Bruno ✅
func GetProductByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var p Product

	err := db.QueryRow("SELECT product_id, product_name, description, category, price, stock_quantity FROM products WHERE product_id = $1", id).Scan(&p.ID, &p.Name, &p.Description, &p.Category, &p.Price, &p.Stock)
	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Tested with Bruno ✅
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := db.QueryRow(
		"INSERT INTO products (product_name, description, category, price, stock_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING product_id",
		p.Name, p.Description, p.Category, p.Price, p.Stock).Scan(&p.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Tested with Bruno ✅
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var p Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	p.ID, _ = strconv.Atoi(id)

	_, err := db.Exec("UPDATE products SET product_name=$1, description=$2, category=$3, price=$4, stock_quantity=$5 WHERE product_id=$6",
		p.Name, p.Description, p.Category, p.Price, p.Stock, p.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// Tested with Bruno ✅
func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	_, err := db.Exec("DELETE FROM products WHERE product_id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

///////////////////  CUSTOMERS ////////////////////

// Tested with Bruno ✅
func GetCustomers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT customer_id, first_name, last_name, email, password, created_at FROM customers")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	customers := []Customer{}
	for rows.Next() {
		var c Customer
		if err := rows.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Password, &c.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		customers = append(customers, c)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(customers)
}

// Tested with Bruno ✅
func GetCustomerByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var c Customer
	err := db.QueryRow("SELECT customer_id, first_name, last_name, email, password, created_at FROM customers WHERE customer_id = $1", id).Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Password, &c.CreatedAt)
	if err == sql.ErrNoRows {
		http.Error(w, "Customer not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// Tested with Bruno ✅
func CreateCustomer(w http.ResponseWriter, r *http.Request) {
	var c Customer
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := db.QueryRow(
		"INSERT INTO customers (first_name, last_name, email, password, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING customer_id",
		c.FirstName, c.LastName, c.Email, c.Password).Scan(&c.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// Tested with Bruno ✅
func UpdateCustomer(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var c Customer
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	c.ID, _ = strconv.Atoi(id)

	_, err := db.Exec("UPDATE customers SET first_name=$1, last_name=$2, email=$3, password=$4 WHERE customer_id=$5",
		c.FirstName, c.LastName, c.Email, c.Password, c.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

// Tested with Bruno ✅
func DeleteCustomer(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	_, err := db.Exec("DELETE FROM customers WHERE customer_id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

/////////////////// ORDERS ////////////////////

// Tested with Bruno ✅
func GetOrders(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT order_id, customer_id, order_date, status FROM orders")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	orders := []Order{}
	for rows.Next() {
		var o Order
		if err := rows.Scan(&o.ID, &o.CustomerID, &o.OrderDate, &o.Status); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		orders = append(orders, o)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

// Tested with Bruno ✅
func GetOrderByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var o Order
	err := db.QueryRow("SELECT order_id, customer_id, order_date, status FROM orders WHERE order_id = $1", id).Scan(&o.ID, &o.CustomerID, &o.OrderDate, &o.Status)
	if err == sql.ErrNoRows {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(o)
}

// Tested with Bruno ✅
func CreateOrder(w http.ResponseWriter, r *http.Request) {
	var o Order
	if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := db.QueryRow(
		"INSERT INTO orders (customer_id, order_date, status) VALUES ($1, CURRENT_TIMESTAMP, $2) RETURNING order_id",
		o.CustomerID, "pending").Scan(&o.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(o)
}

// Tested with Bruno ✅
func UpdateOrder(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var o Order
	if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	o.ID, _ = strconv.Atoi(id)

	_, err := db.Exec("UPDATE orders SET status=$1 WHERE order_id=$2",
		o.Status, o.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(o)
}

// Tested with Bruno ✅
func DeleteOrder(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	_, err := db.Exec("DELETE FROM orders WHERE order_id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

/////////////////////////// ORDER ITEMS //////////////////////////////////

// Tested with Bruno ✅
func GetOrderItems(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "order_id")
	rows, err := db.Query("SELECT order_item_id, order_id, product_id, quantity, price FROM order_items WHERE order_id = $1", orderID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	orderItems := []OrderItem{}
	for rows.Next() {
		var oi OrderItem
		if err := rows.Scan(&oi.ID, &oi.OrderID, &oi.ProductID, &oi.Quantity, &oi.Price); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		orderItems = append(orderItems, oi)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orderItems)
}

// Tested with Bruno ✅
func GetOrderItemByID(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "order_id")
	id := chi.URLParam(r, "id")
	var oi OrderItem
	err := db.QueryRow("SELECT order_item_id, order_id, product_id, quantity, price FROM order_items WHERE order_id = $1 AND order_item_id = $2", orderID, id).Scan(&oi.ID, &oi.OrderID, &oi.ProductID, &oi.Quantity, &oi.Price)
	if err == sql.ErrNoRows {
		http.Error(w, "Order item not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(oi)
}

// Tested with Bruno ✅
func CreateOrderItem(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "order_id")
	var oi OrderItem
	if err := json.NewDecoder(r.Body).Decode(&oi); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	oi.OrderID, _ = strconv.Atoi(orderID)

	// Getting Product Info
	var p Product

	err := db.QueryRow("SELECT price, stock_quantity FROM products WHERE product_id = $1", oi.ProductID).Scan(&p.Price, &p.Stock)
	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Checking if the Client requests more Items than we have in Stock
	if p.Stock < oi.Quantity {
		http.Error(w, fmt.Sprintf("Insufficient Stock Quantity for Product (%s)", p.Name), http.StatusUnprocessableEntity)
		return
	}

	// Decreasing the Stock Quantity of the Product
	newQuantity := p.Stock - oi.Quantity
	_, err = db.Exec(
		"UPDATE products SET stock_quantity=$1 WHERE product_id=$2",
		newQuantity, oi.ProductID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Calculating the Price based on the Product Price + the requested Quantity
	// And Create a new Order Item
	price := p.Price * float64(oi.Quantity)
	err = db.QueryRow(
		"INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING order_item_id",
		oi.OrderID, oi.ProductID, oi.Quantity, price).Scan(&oi.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(oi)
}

// Tested with Bruno ✅
func UpdateOrderItem(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "order_id")
	id := chi.URLParam(r, "id")
	var oi OrderItem
	if err := json.NewDecoder(r.Body).Decode(&oi); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	oi.ID, _ = strconv.Atoi(id)
	oi.OrderID, _ = strconv.Atoi(orderID)

	// Getting Product ID using Order Item ID
	err := db.QueryRow("SELECT product_id FROM order_items WHERE order_item_id = $1", id).Scan(&oi.ProductID)
	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Getting Product Info using Product ID
	var p Product

	err = db.QueryRow("SELECT price, stock_quantity FROM products WHERE product_id = $1", oi.ProductID).Scan(&p.Price, &p.Stock)
	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if p.Stock < oi.Quantity {
		http.Error(w, fmt.Sprintf("Insufficient Stock Quantity for Product (%s)", p.Name), http.StatusUnprocessableEntity)
		return
	}

	// Decreasing the Stock Quantity of the Product
	newQuantity := p.Stock - oi.Quantity
	_, err = db.Exec(
		"UPDATE products SET stock_quantity=$1 WHERE product_id=$2",
		newQuantity, oi.ProductID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	price := float64(oi.Quantity) * p.Price
	_, err = db.Exec("UPDATE order_items SET quantity=$1, price=$2 WHERE order_item_id=$3 AND order_id=$4",
		oi.Quantity, price, oi.ID, oi.OrderID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(oi)
}

// Tested with Bruno ✅
func DeleteOrderItem(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "order_id")
	id := chi.URLParam(r, "id")

	_, err := db.Exec("DELETE FROM order_items WHERE order_item_id=$1 AND order_id=$2", id, orderID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
