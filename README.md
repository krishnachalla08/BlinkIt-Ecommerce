# 🛒 Blinkit-Style E-Commerce Platform (Farm N Fresh) (Microservices)

A scalable **microservices-based e-commerce application** built using **Spring Boot, Angular, and AWS**, designed to simulate a real-world Blinkit/Instamart-style system.

---

## 🚀 Tech Stack

### 🔹 Backend

* Java + Spring Boot (Microservices)
* Spring Cloud Gateway (API Gateway)
* Spring Security + JWT Authentication
* Spring Data JPA (Hibernate)
* Redis (Cart Service)

### 🔹 Frontend

* Angular (Standalone Components)
* RxJS + HTTP Interceptors
* Responsive UI (Amazon-style product & order views)

### 🔹 Database & Storage

* Amazon RDS (MySQL/PostgreSQL)
* Amazon S3 (Product Images)
* Redis (Caching & Cart)

### 🔹 DevOps

* Docker (Containerization)
* Docker Compose (Local orchestration)
* AWS EC2 (Deployment)
* GitHub Actions (CI/CD Pipeline)

---

## 🧩 Microservices Architecture

```
Client (Angular)
       ↓
API Gateway (Spring Cloud Gateway)
       ↓
----------------------------------------
| Auth Service     | Product Service   |
| Cart Service     | Order Service     |
----------------------------------------
       ↓
 Databases (RDS) + Redis + S3
```

---

## 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. JWT token is generated
3. Token is passed in `Authorization` header
4. API Gateway:

   * Validates JWT
   * Extracts `userId`
   * Injects `X-User-Id` header
5. Downstream services trust this header

---

## 📦 Features

### 👤 Authentication

* User Login / Signup
* JWT-based authentication
* Role-based access (Admin/User)

### 🛍️ Product Service

* View products (public access)
* Add/update/delete products (Admin)
* Image upload to S3

### 🛒 Cart Service

* Add/remove items
* Redis-based fast access
* Per-user cart isolation

### 📦 Order Service

* Checkout flow
* Order persistence
* Order history (My Orders)
* Order items tracking

### 💻 Frontend (Angular)

* Product listing (no login required)
* Quick View modal (Amazon-style)
* Add to Cart
* My Orders page
* JWT interceptor for API calls

---

## ⚙️ Local Setup

### 🔧 Prerequisites

* Java 17+
* Node.js (v18+)
* Angular CLI
* Docker & Docker Compose

---

### 🐳 Run with Docker

```bash
docker-compose up --build
```

---

### 🌐 Services & Ports

| Service         | Port |
| --------------- | ---- |
| API Gateway     | 9000 |
| Auth Service    | 9001 |
| Product Service | 9002 |
| Cart Service    | 9004 |
| Order Service   | 9005 |
| Angular App     | 4200 |

---

## 🔑 Environment Variables

Create a `.env` file:

```
DB_URL=your_rds_url
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key

AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

---

## 🌍 API Endpoints

### 🔐 Auth

* `POST /auth/login`
* `POST /auth/register`

### 🛍️ Products

* `GET /products` (public)
* `POST /products` (admin)

### 🛒 Cart

* `GET /cart`
* `POST /cart/add`
* `DELETE /cart/remove`

### 📦 Orders

* `POST /orders/checkout`
* `GET /orders` (My Orders)

---

## 🧠 Key Design Decisions

* **API Gateway handles authentication**
* **Microservices communicate via REST**
* **User identity propagated via headers**
* **Frontend does NOT send userId explicitly**
* **DTO-based response design (no entity exposure)**

---

## 🐳 Dockerization

Each service has its own `Dockerfile`.

Example:

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## ☁️ Deployment (AWS)

### Steps:

1. Build Docker images
2. Push to Docker Hub / ECR
3. Launch EC2 instance
4. Install Docker
5. Run `docker-compose up -d`
6. Configure Nginx (optional)
7. Use public IP as base URL

---

## 🔄 CI/CD (GitHub Actions)

* Build backend services
* Build Angular app
* Build Docker images
* Push to registry
* Deploy to EC2

---

## 📸 Screenshots (Optional)

* Product Listing
* Quick View Modal
* Cart Page
* Orders Page

---

## 🚀 Future Enhancements

* Payment Integration (Stripe/Razorpay)
* Inventory Management
* Order Tracking (Real-time)
* Notifications (Email/SMS)
* ElasticSearch for product search
* Kubernetes deployment

---

## 👨‍💻 Author

**Krishna Challa**
Associate Software Engineer
Full Stack Developer (Angular + Spring Boot)

---

## ⭐ Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📜 License

This project is for learning and demonstration purposes.
