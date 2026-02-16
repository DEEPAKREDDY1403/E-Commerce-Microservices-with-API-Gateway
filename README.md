# E-Commerce Microservices Project

A complete microservices-based e-commerce backend system built with Node.js, Express, MongoDB, and JWT authentication.

## Architecture

```
                AUTH SERVICE (Port 5001)
                      ↑
                      |
                API GATEWAY (Port 5000)
                      |
                      ↓
              PRODUCT SERVICE (Port 5002)
```

**Important:** Clients should ONLY communicate with the API Gateway (Port 5000). Direct access to services is not allowed.

##  Features

- ✅ Microservices Architecture
- ✅ API Gateway with routing
- ✅ JWT Authentication
- ✅ Role-Based Access Control (USER, ADMIN)
- ✅ MongoDB Database
- ✅ Swagger API Documentation
- ✅ Docker Support
- ✅ Service-to-Service Communication

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **API Gateway:** http-proxy-middleware
- **Documentation:** Swagger
- **Containerization:** Docker & Docker Compose

### Installation

#### Option 1: Running Locally (Without Docker)

1. **Extract the ZIP file**
   ```bash
   unzip microservices-ecommerce.zip
   cd microservices-ecommerce
   ```

2. **Install dependencies for each service**
   
   Open 3 separate terminal windows/tabs:

   **Terminal 1 - Auth Service:**
   ```bash
   cd auth-service
   npm install
   ```

   **Terminal 2 - Product Service:**
   ```bash
   cd product-service
   npm install
   ```

   **Terminal 3 - API Gateway:**
   ```bash
   cd api-gateway
   npm install
   ```

3. **Make sure MongoDB is running**
   
   Start MongoDB on your system. On most systems:
   ```bash
   # Windows: MongoDB should start automatically if installed as a service
   # Mac: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   ```

   Verify MongoDB is running:
   ```bash
   mongosh
   # If it connects, MongoDB is running. Type 'exit' to quit.
   ```

4. **Start all services**

   In each terminal window:

   **Terminal 1 - Auth Service:**
   ```bash
   cd auth-service
   npm start
   ```
   Wait for message: ` MongoDB Connected` and ` Auth Service running on port 5001`

   **Terminal 2 - Product Service:**
   ```bash
   cd product-service
   npm start
   ```
   Wait for message: ` MongoDB Connected` and ` Product Service running on port 5002`

   **Terminal 3 - API Gateway:**
   ```bash
   cd api-gateway
   npm start
   ```
   Wait for message: ` API Gateway running on port 5000`

5. **Verify everything is running**
   
   Open your browser and visit:
   - API Gateway: http://localhost:5000/health
   - Auth Service: http://localhost:5001/health
   - Product Service: http://localhost:5002/health

   All should return a success message.

#### Option 2: Running with Docker

1. **Extract the ZIP file**
   ```bash
   unzip microservices-ecommerce.zip
   cd microservices-ecommerce
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build all Docker images
   - Start MongoDB
   - Start Auth Service
   - Start Product Service
   - Start API Gateway

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

   All services should show as "Up"

4. **To stop all services:**
   ```bash
   docker-compose down
   ```

##  API Documentation

Once the services are running, you can access Swagger documentation at:

- **API Gateway (Recommended):** http://localhost:5000/api-docs
- Auth Service: http://localhost:5001/api-docs
- Product Service: http://localhost:5002/api-docs

##  Testing the Application

### Step 1: Register a User

**Endpoint:** `POST http://localhost:5000/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"USER"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token!** You'll need it for authenticated requests.

### Step 2: Register an Admin User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

### Step 3: Login

**Endpoint:** `POST http://localhost:5000/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Step 4: Create a Product (Authenticated)

**Endpoint:** `POST http://localhost:5000/products`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 999.99
}
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"iPhone 15","description":"Latest Apple smartphone","price":999.99}'
```

### Step 5: Get All Products (Public)

**Endpoint:** `GET http://localhost:5000/products`

**Using curl:**
```bash
curl http://localhost:5000/products
```

### Step 6: Update a Product (Authenticated, Owner Only)

**Endpoint:** `PUT http://localhost:5000/products/{productId}`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "price": 1099.99
}
```

**Using curl:**
```bash
curl -X PUT http://localhost:5000/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"iPhone 15 Pro","price":1099.99}'
```

### Step 7: Delete a Product (Admin Only)

**Endpoint:** `DELETE http://localhost:5000/products/{productId}`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN_HERE
```

**Using curl:**
```bash
curl -X DELETE http://localhost:5000/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```


## API Endpoints

### Auth Service (via Gateway)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login user | No |
| GET | /auth/validate-token | Validate JWT token | Yes |

### Product Service (via Gateway)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | /products | Create product | Yes | USER/ADMIN |
| GET | /products | Get all products | No | - |
| GET | /products/:id | Get product by ID | No | - |
| PUT | /products/:id | Update product | Yes | Owner/ADMIN |
| DELETE | /products/:id | Delete product | Yes | ADMIN |

