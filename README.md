# MedCore HMS — Healthcare Management System

A full-stack healthcare management platform built with **Spring Boot 3** and **Angular 17**. Supports three roles — Patient, Provider (doctor), and Admin — each with dedicated workflows for appointments, prescriptions, billing, and reporting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt 0.12.3), BCrypt password hashing |
| Database | MySQL 8 |
| Frontend | Angular 17 (standalone components, lazy routes) |
| Styling | Custom enterprise design system (Inter font, dark sidebar) |
| Build | Maven multi-module, frontend-maven-plugin |

---

## Features by Role

### Patient
- Schedule and cancel appointments with any provider
- View upcoming and past appointments with status tracking
- View prescriptions issued by providers
- View invoices, pay online, or submit insurance claims
- Edit personal profile, medical history, allergies, and insurance info

### Provider (Doctor)
- View and manage their appointment calendar
- Confirm, complete, or cancel appointments
- Create, edit, and delete prescriptions
- Send prescriptions to pharmacy
- Create invoices for patient services
- View full patient list and profiles

### Admin
- View all system activity: appointments, patients, billing, prescriptions
- User management dashboard — see all accounts by role
- Reporting dashboard — generate revenue and appointment reports by date range, export CSV
- Full access to all provider and patient workflows

---

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Administrator |
| `dr.smith` | `doctor123` | Dr. Sarah Smith — Internal Medicine |
| `dr.jones` | `doctor123` | Dr. Michael Jones — General Practice |
| `dr.chen` | `doctor123` | Dr. Emily Chen — Cardiology |
| `dr.wilson` | `doctor123` | Dr. Robert Wilson — Orthopedics |
| `dr.martinez` | `doctor123` | Dr. Lisa Martinez — Neurology |
| `john.doe` | `patient123` | Patient |
| `jane.doe` | `patient123` | Patient |
| `michael.johnson` | `patient123` | Patient |
| `sarah.williams` | `patient123` | Patient |
| `robert.brown` | `patient123` | Patient |
| `emily.davis` | `patient123` | Patient |
| `david.miller` | `patient123` | Patient |
| `jennifer.wilson` | `patient123` | Patient |

> Demo data is auto-seeded on first startup when the database is empty.

---

## Local Development

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 20+
- MySQL 8

### 1. Clone and configure
```bash
git clone https://github.com/craft-b/healthcare-management-system
cd healthcare-management-system
```

Create `backend/src/main/resources/application.properties` (gitignored):
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/hsmdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
app.jwt.secret=dev-secret-key-change-in-production-must-be-256-bits-long
app.jwt.expiration-ms=86400000
app.cors.allowed-origins=http://localhost:4200
```

### 2. Start the backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8081
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:4200 (proxies /api/* → localhost:8081)
```

---

## Deployment (Railway)

The app builds into a **single JAR** that serves both the API and the Angular frontend.

### Railway setup
1. Connect your GitHub repo to Railway
2. Add a **MySQL** plugin — Railway auto-injects `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`
3. Set environment variables on the service:

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | any strong random string (32+ chars) |

Railway auto-detects `railway.toml` and runs:
- **Build:** `cd backend && mvn package -DskipTests` (builds Angular + Spring Boot JAR)
- **Start:** `java -Dspring.profiles.active=prod -jar backend/target/hms-backend-0.0.1-SNAPSHOT.jar`

---

## Project Structure

```
healthcare-management-system/
├── backend/                        # Spring Boot API
│   └── src/main/java/com/hms/
│       ├── config/                 # Security, JWT, DataSeeder, SpaController
│       ├── controller/             # REST controllers (auth, patients, appointments, ...)
│       ├── dto/                    # Request/response DTOs
│       ├── exception/              # Global exception handler
│       ├── model/                  # JPA entities (User, Patient, Appointment, ...)
│       ├── repository/             # Spring Data repositories (JOIN FETCH queries)
│       └── service/                # Business logic
├── frontend/                       # Angular 17 SPA
│   └── src/app/
│       ├── core/                   # Services, interceptors, guards, models
│       ├── features/               # Page components (dashboard, appointments, ...)
│       └── shared/                 # Sidebar navigation
├── railway.toml                    # Railway deployment config
└── pom.xml                         # Maven parent POM
```

---

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET/POST | `/api/appointments` | Authenticated |
| PATCH | `/api/appointments/{id}/status` | Provider / Admin |
| GET/POST/PUT/DELETE | `/api/patients` | Authenticated |
| GET/POST/PUT/DELETE | `/api/prescriptions` | Authenticated |
| GET/POST | `/api/invoices` | Authenticated |
| GET | `/api/providers` | Authenticated |
| GET | `/api/admin/users` | Admin only |
| GET | `/api/reports` | Admin only |
