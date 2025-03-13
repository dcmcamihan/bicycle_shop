# Bicycle Shop API

This is a Node.js application for managing a bicycle shop. It provides endpoints for managing employees, customers, products, and sales.

## Prerequisites

- Node.js (v14 or higher)
- MySQL

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bicycle_shop.git
    cd bicycle_shop
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure the environment variables:**

    - Update the [.env](http://_vscodecontentref_/1) file in the root directory with the following content:

    ```plaintext
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=dbbicycle_supply
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

    The server will start on port 3000 by default.

## Assumptions

- The necessary tables (`employee`, `customer`, `product`, `sale`) already exist in the `dbbicycle_supply` database.

## API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get an employee by ID
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update an employee by ID
- `DELETE /api/employees/:id` - Delete an employee by ID

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer by ID
- `DELETE /api/customers/:id` - Delete a customer by ID

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product by ID
- `DELETE /api/products/:id` - Delete a product by ID

### Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get a sale by ID
- `POST /api/sales` - Create a new sale
- `PUT /api/sales/:id` - Update a sale by ID
- `DELETE /api/sales/:id` - Delete a sale by ID