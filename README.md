

# ✅ **Project: Distributed Task Management Microservice System (Node.js / Express / RabbitMQ / Redis)**

## **Overview**

I engineered a **scalable, production-grade task management system** using a microservices architecture. The platform consists of independent services communicating via REST and **asynchronous message queues (RabbitMQ)**, enabling loose coupling, high availability, and horizontal scalability.

The project demonstrates my understanding of **system design**, **distributed communication**, **event-driven patterns**, **API gateway design**, and **cloud-ready backend engineering**.

---

# 🚀 **Core Microservices & Responsibilities**

### 🔹 **1. API Gateway**

* Acts as the single entry point for all client requests.
* Implements request routing, rate limiting, authentication, and service aggregation.
* Built with **Express + JWT + Reverse Proxy logic**.
* Simplifies client communication, improves security, and hides internal microservice structure.

---

### 🔹 **2. User Service**

* Handles user registration, authentication, sessions, and profile updates.
* Uses **JWT** for stateless authentication.
* Provides RBAC (Role-Based Access Control) for admin vs. regular users.
* Stores user data in a dedicated database (MongoDB / PostgreSQL depending on configuration).

---

### 🔹 **3. Task Service**

* Manages all task-related operations: creation, assignment, deadlines, statuses.
* Designed using **CQRS-friendly patterns** to prepare for scaling reads/writes.
* Publishes task events (e.g., *task_created*, *task_assigned*) to RabbitMQ for other services.

---

### 🔹 **4. Notification Service**

* Fully **event-driven** using RabbitMQ.
* Listens for events such as:

  * `user_created`
  * `task_created`
  * `task_assigned`
* Sends email/SMS/in-app notifications based on event type.
* Ensures **reliable messaging** with dead-letter queues and retry logic.

---

### 🔹 **5. Media Service**

* Handles file uploads (images, documents) associated with tasks or user profiles.
* Integrates with cloud storage (AWS S3, Cloudinary, or local FS for development).
* Provides secure public/private file access through signed URLs.

---

# ⚙️ **Infrastructure & Tools**

### 🟧 **Message Broker — RabbitMQ**

* Enables asynchronous service-to-service communication.
* Decouples operations and prevents system blocking during heavy processing.
* Used for:

  * User registration events
  * Task events
  * Notification triggering

---

### 🟩 **Caching — Redis**

* Used as a cache layer for:

  * Session tokens
  * Task query results
  * API rate limiting via the gateway
* Significantly improves performance and reduces load on main databases.

---

# 🔐 **Security**

* JWT authentication at the gateway.
* Environment-based configuration using dotenv.
* API rate limiting + brute-force protection.
* Secure file uploads.

---

# 📈 **Key Features**

* Distributed architecture with independent microservices.
* Event-driven notifications.
* Scalable task management with asynchronous processing.
* Robust file management solution.
* Polyglot persistence capability (each service can choose its own DB).
* Fault tolerance with message retries and dead-letter queues.
* Easy to deploy, thanks to Dockerized environment.

---

# 📌 **Tech Stack Summary**

### **Backend**

* Node.js / Express.js
* RabbitMQ
* Redis
* MongoDB / PostgreSQL (or both depending on configuration)


### **Others**

* JWT Auth
* Multer (or Cloudinary lib) for media upload
* Nodemailer / Mail service for notifications
* Winston / Morgan for logging

