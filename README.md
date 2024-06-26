# E-Commerce API Documentation

This is the documentation for the E-Commerce RESTful API application built with Node.js, Express.js, Sequelize, and PostgreSQL.

## Prerequisites

- Node.js
- PostgreSQL
- Docker

## Installation

**1. Clone the repository**

```
git clone https://github.com/alethrome/e-commerce-app.git
cd e-commerce-app
```
**2. Install dependencies**
```
npm install
```
**3. Setup environment variables**
```
NODE_ENV=development
PORT=5000
EXPIRY=10m
```

## Database Setup

**1. Install Sequelize CLI**
```
npm install -g sequelize-cli
```
**2. Initialize Sequelize**
```
npx sequelize-cli init
```
**3. Configure Database Connection**

After initializing, configure the connection of the database in the `src/config/config.json`	. Adjust the values according to your database setup.
```
{
  "development": {
    "username": "your_database_user",
    "password": "your_database_password",
    "database": "your_database_name",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "your_database_user",
    "password": "your_database_password",
    "database": "your_database_name",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "your_database_user",
    "password": "your_database_password",
    "database": "your_database_name",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```
**4. Create a PostgreSQL database.**

Create a PostgreSQL database and configure the connection details in your `config.json` file.

**5. Run Migrations**
```
npx sequelize-cli db:migrate
```

## Run application locally

Start the application in development mode.
```
npm run server
```
The server will start at `http://localhost:5000`.

## Run application with Docker

**1. Build the docker image.**
```
docker compose 	up -d node_db
```
**2. Run the docker container.**
```
docker compose build
```
**3. Access the application:**

The server inside the Docker container will be accessible at `http://localhost:5000`.

## API Endpoints

### Products

-   **POST /product/create**: Create a new product.
-   **GET /product/all** : Get all products.
-   **GET /product/:productId**: Get a single product by ID.
-   **PATCH /product/:productId**: Update a product by ID.
-   **DELETE /product/:productId**: Delete a product by ID.

### Cart Items

-   **POST /cart/insert**: Insert item to cart.
-   **GET /cart/all** : Get all items in cart.
-   **PUT /cart/:itemId**: Update a cart item by ID.
-   **DELETE /cart/delete/:itemId**: Delete a cart item by ID.

### Orders

-   **POST /order**: Create a new order.
-   **GET /order/list** : Get all orders.
-   **GET /order/:orderId**: Get a single order by ID.
-   **PATCH /order/order-status/:orderId**: Update a order status by ID.
-   **PATCH /order/pay/:orderId**: Pay an order by ID.

### Users

-   **POST /user/register**: Create a new product.
-   **GET /user/all** : Get all products.

### Login
- **POST /login**: Login user
>**Note:** Products, Cart Items, and Orders API Endpoints are protected. Use the access token given when the user is logged in.

## Project Structure
```
├── src
│   ├───config
│   │       config.json
│   │       database.js
│   │       logger.js
│   ├───controllers
│   │       authController.js
│   │       cartItemController.js
│   │       orderController.js
│   │       productController.js
│   │       userController.js
│   ├───keys
│   │       private_key.pem
│   │       public_key.pem
│   ├───middlewares
│   │       authMiddleware.js
│   │       uploadMiddleware.js
│   ├───migrations
│   │       20240621024808-create-user.js
│   │       20240621034520-create-product.js
│   │       20240621052703-create-cart-item.js
│   │       20240621062949-create-order.js
│   │       20240621063139-create-order-item.js
│   ├───models
│   │       CartItem.js
│   │       index.js
│   │       Order.js
│   │       OrderItem.js
│   │       Product.js
│   │       User.js
│   ├───routes
│   │   	authRoutes.js
│   │       cartRoutes.js
│   │       orderRoutes.js
│   │       productRoutes.js
│   │       userRoutes.js
├── test
│   	api.test.js
│   	auth.test.js
│   	cart.test.js
│   	order.test.js
│   	product.test.js
├── .env
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
└── README.md
```
## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
