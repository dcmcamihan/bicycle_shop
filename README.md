# Bicycle Shop Management System

This is a comprehensive management system for a bicycle shop, built with Node.js for the backend and a simple HTML/CSS/JavaScript frontend. The system provides endpoints for managing employees, customers, products, sales, and other related entities.

## Prerequisites

- Node.js (v14 or higher)
- MySQL

## Project Structure

```
bicycle_shop/
├── backend/
│   ├── .env
│   ├── README.md
│   ├── dbbicycle_supply.sql
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── routes/
│   │   │   ├── employeeRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── saleRoutes.js
│   │   │   ├── brandRoutes.js
│   │   │   ├── customerContactRoutes.js
│   │   │   ├── employeeContactRoutes.js
│   │   │   ├── paymentMethodRoutes.js
│   │   │   ├── supplierRoutes.js
│   │   │   ├── supplyRoutes.js
│   │   │   ├── supplierContactRoutes.js
│   │   │   ├── attendanceDetailsRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── contactTypeRoutes.js
│   │   │   ├── employeeAttendanceRoutes.js
│   │   │   ├── employeeRoleRoutes.js
│   │   │   ├── employeeRoleHistoryRoutes.js
│   │   │   ├── returnAndReplacementRoutes.js
│   │   │   ├── roleTypeRoutes.js
│   │   │   ├── saleDetailsRoutes.js
│   │   │   ├── salePaymentTypeRoutes.js
│   │   │   ├── statusRoutes.js
│   │   │   ├── statusReferenceCodeRoutes.js
│   │   │   ├── stockoutRoutes.js
│   │   │   ├── supplierAddressRoutes.js
│   │   │   └── supplyDetailsRoutes.js
├── frontend/
│   ├── .gitignore
│   ├── dashboard.css
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── index.html
│   ├── login.css
│   ├── login.html
│   ├── README.md
│   ├── script.js
│   ├── styles.css
│   ├── img/
│   │   ├── bike-icon.png
│   │   ├── bike-img5.svg
│   │   ├── bike-img6.svg
│   │   ├── bike-img7.svg
│   │   ├── favicon.ico
│   │   ├── logo-dark.png
│   │   ├── logo.png
│   │   └── topbar-img.png
│   ├── panel/
│   │   ├── customers/
│   │   │   ├── customer-contact.css
│   │   │   ├── customer-contact.html
│   │   │   ├── customer-contact.js
│   │   │   ├── customer-list.css
│   │   │   ├── customer-list.html
│   │   │   └── customer-list.js
│   │   ├── employees/
│   │   │   ├── attendance.css
│   │   │   ├── attendance.html
│   │   │   ├── attendance.js
│   │   │   └── ...
│   │   ├── inventory/
│   │   │   └── ...
│   │   ├── sales/
│   │   │   └── ...
│   │   └── suppliers/
│   │       └── ...
```

## Backend Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bicycle_shop.git
    cd bicycle_shop/backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure the environment variables:**

    - Update the `.env` file in the root directory with the following content:

    ```plaintext
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=''
    DB_NAME=dbbicycle_supply
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

    The server will start on port 3000 by default.

## Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2. **Open `index.html` in your browser to view the application.**

## Database Setup

1. **Import the database schema:**

    - Use a MySQL client to import the `dbbicycle_supply.sql` file into your MySQL server.

    ```bash
    mysql -u root -p dbbicycle_supply < dbbicycle_supply.sql
    ```

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

### Brands

- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get a brand by ID
- `POST /api/brands` - Create a new brand
- `PUT /api/brands/:id` - Update a brand by ID
- `DELETE /api/brands/:id` - Delete a brand by ID

### Customer Contacts

- `GET /api/customer-contacts` - Get all customer contacts
- `GET /api/customer-contacts/:id` - Get a customer contact by ID
- `POST /api/customer-contacts` - Create a new customer contact
- `PUT /api/customer-contacts/:id` - Update a customer contact by ID
- `DELETE /api/customer-contacts/:id` - Delete a customer contact by ID

### Employee Contacts

- `GET /api/employee-contacts` - Get all employee contacts
- `GET /api/employee-contacts/:id` - Get an employee contact by ID
- `POST /api/employee-contacts` - Create a new employee contact
- `PUT /api/employee-contacts/:id` - Update an employee contact by ID
- `DELETE /api/employee-contacts/:id` - Delete an employee contact by ID

### Payment Methods

- `GET /api/payment-methods` - Get all payment methods
- `GET /api/payment-methods/:id` - Get a payment method by ID
- `POST /api/payment-methods` - Create a new payment method
- `PUT /api/payment-methods/:id` - Update a payment method by ID
- `DELETE /api/payment-methods/:id` - Delete a payment method by ID

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get a supplier by ID
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier by ID
- `DELETE /api/suppliers/:id` - Delete a supplier by ID

### Supplies

- `GET /api/supplies` - Get all supplies
- `GET /api/supplies/:id` - Get a supply by ID
- `POST /api/supplies` - Create a new supply
- `PUT /api/supplies/:id` - Update a supply by ID
- `DELETE /api/supplies/:id` - Delete a supply by ID

### Supplier Contacts

- `GET /api/supplier-contacts` - Get all supplier contacts
- `GET /api/supplier-contacts/:id` - Get a supplier contact by ID
- `POST /api/supplier-contacts` - Create a new supplier contact
- `PUT /api/supplier-contacts/:id` - Update a supplier contact by ID
- `DELETE /api/supplier-contacts/:id` - Delete a supplier contact by ID

### Attendance Details

- `GET /api/attendance-details` - Get all attendance details
- `GET /api/attendance-details/:id` - Get attendance details by ID
- `POST /api/attendance-details` - Create new attendance details
- `PUT /api/attendance-details/:id` - Update attendance details by ID
- `DELETE /api/attendance-details/:id` - Delete attendance details by ID

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category by ID
- `DELETE /api/categories/:id` - Delete a category by ID

### Contact Types

- `GET /api/contact-types` - Get all contact types
- `GET /api/contact-types/:id` - Get a contact type by ID
- `POST /api/contact-types` - Create a new contact type
- `PUT /api/contact-types/:id` - Update a contact type by ID
- `DELETE /api/contact-types/:id` - Delete a contact type by ID

### Employee Attendances

- `GET /api/employee-attendances` - Get all employee attendances
- `GET /api/employee-attendances/:id` - Get an employee attendance by ID
- `POST /api/employee-attendances` - Create a new employee attendance
- `PUT /api/employee-attendances/:id` - Update an employee attendance by ID
- `DELETE /api/employee-attendances/:id` - Delete an employee attendance by ID

### Employee Roles

- `GET /api/employee-roles` - Get all employee roles
- `GET /api/employee-roles/:id` - Get an employee role by ID
- `POST /api/employee-roles` - Create a new employee role
- `PUT /api/employee-roles/:id` - Update an employee role by ID
- `DELETE /api/employee-roles/:id` - Delete an employee role by ID

### Employee Role Histories

- `GET /api/employee-role-histories` - Get all employee role histories
- `GET /api/employee-role-histories/:id` - Get an employee role history by ID
- `POST /api/employee-role-histories` - Create a new employee role history
- `PUT /api/employee-role-histories/:id` - Update an employee role history by ID
- `DELETE /api/employee-role-histories/:id` - Delete an employee role history by ID

### Return and Replacements

- `GET /api/return-and-replacements` - Get all return and replacements
- `GET /api/return-and-replacements/:id` - Get a return and replacement by ID
- `POST /api/return-and-replacements` - Create a new return and replacement
- `PUT /api/return-and-replacements/:id` - Update a return and replacement by ID
- `DELETE /api/return-and-replacements/:id` - Delete a return and replacement by ID

### Role Types

- `GET /api/role-types` - Get all role types
- `GET /api/role-types/:id` - Get a role type by ID
- `POST /api/role-types` - Create a new role type
- `PUT /api/role-types/:id` - Update a role type by ID
- `DELETE /api/role-types/:id` - Delete a role type by ID

### Sale Details

- `GET /api/sale-details` - Get all sale details
- `GET /api/sale-details/:id` - Get a sale detail by ID
- `POST /api/sale-details` - Create a new sale detail
- `PUT /api/sale-details/:id` - Update a sale detail by ID
- `DELETE /api/sale-details/:id` - Delete a sale detail by ID

### Sale Payment Types

- `GET /api/sale-payment-types` - Get all sale payment types
- `GET /api/sale-payment-types/:id` - Get a sale payment type by ID
- `POST /api/sale-payment-types` - Create a new sale payment type
- `PUT /api/sale-payment-types/:id` - Update a sale payment type by ID
- `DELETE /api/sale-payment-types/:id` - Delete a sale payment type by ID

### Statuses

- `GET /api/statuses` - Get all statuses
- `GET /api/statuses/:id` - Get a status by ID
- `POST /api/statuses` - Create a new status
- `PUT /api/statuses/:id` - Update a status by ID
- `DELETE /api/statuses/:id` - Delete a status by ID

### Status Reference Codes

- `GET /api/status-reference-codes` - Get all status reference codes
- `GET /api/status-reference-codes/:id` - Get a status reference code by ID
- `POST /api/status-reference-codes` - Create a new status reference code
- `PUT /api/status-reference-codes/:id` - Update a status reference code by ID
- `DELETE /api/status-reference-codes/:id` - Delete a status reference code by ID

### Stockouts

- `GET /api/stockouts` - Get all stockouts
- `GET /api/stockouts/:id` - Get a stockout by ID
- `POST /api/stockouts` - Create a new stockout
- `PUT /api/stockouts/:id` - Update a stockout by ID
- `DELETE /api/stockouts/:id` - Delete a stockout by ID

### Supplier Addresses

- `GET /api/supplier-addresses` - Get all supplier addresses
- `GET /api/supplier-addresses/:id` - Get a supplier address by ID
- `POST /api/supplier-addresses` - Create a new supplier address
- `PUT /api/supplier-addresses/:id` - Update a supplier address by ID
- `DELETE /api/supplier-addresses/:id` - Delete a supplier address by ID

### Supply Details

- `GET /api/supply-details` - Get all supply details
- `GET /api/supply-details/:id` - Get a supply detail by ID
- `POST /api/supply-details` - Create a new supply detail
- `PUT /api/supply-details/:id` - Update a supply detail by ID
- `DELETE /api/supply-details/:id` - Delete a supply detail by ID

## Wireframe
### Landing Page
![Landing Page](https://github.com/user-attachments/assets/9f44d99b-cb42-4a10-bbcf-309402c494d6)
### Login Page
![Login Page](https://github.com/user-attachments/assets/9a51977f-df07-49b3-b262-2d358197d0bd)
### Dashboard and Panel
![Products List - Light Mode](https://github.com/user-attachments/assets/247157b0-3fb4-42b4-9ed6-016742adf4b1)
![Products List - Dark Mode](https://github.com/user-attachments/assets/8420cc4d-7161-4028-bf25-03a3d0254c6e)

![Brands   Categories - Light Mode](https://github.com/user-attachments/assets/268777ae-6799-445d-a3bf-57911fa0a745)
![Brands   Categories - Dark Mode](https://github.com/user-attachments/assets/54db8192-1a07-4c0a-b7a7-68c7904fbf9e)

![Employee List - Light Mode](https://github.com/user-attachments/assets/31f0c4c9-a08e-4c76-908f-ab34754b9420)
![Employee List - Dark Mode](https://github.com/user-attachments/assets/38ba02a9-fcfe-425d-a45f-56be888e0665)

## Working Application







