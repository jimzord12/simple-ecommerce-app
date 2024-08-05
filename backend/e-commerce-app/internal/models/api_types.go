package models

type Product struct {
	ID          int     `json:"product_id"`
	Name        string  `json:"product_name"`
	Category    string  `json:"category"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock_quantity"`
}

type Customer struct {
	ID        int    `json:"customer_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt string `json:"created_at"`
}

type Order struct {
	ID         int    `json:"order_id"`
	CustomerID int    `json:"customer_id"`
	OrderDate  string `json:"order_date"`
	Status     string `json:"status"`
}

type OrderItem struct {
	ID        int     `json:"order_item_id"`
	OrderID   int     `json:"order_id"`
	ProductID int     `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}
