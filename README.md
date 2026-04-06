<div align="center">

# MedCore HMS

### Healthcare Management System

A production-ready, full-stack healthcare platform built with **Spring Boot 3** and **Angular 17** — demonstrating role-based access control, JWT authentication, a normalized relational data model, and a clean enterprise UI inspired by Epic MyChart and One Medical.

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Railway](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app/)

**[Live Demo →](https://your-app.railway.app)** &nbsp;|&nbsp; **[API Health →](https://your-app.railway.app/api/auth/health)**

</div>

---

## Overview

MedCore HMS models a real clinical workflow across three distinct user roles — Patient, Provider, and Administrator. Each role exposes only the capabilities appropriate to it, enforced at both the API and UI layers.

The application is deployed as a **single JAR** — the Angular SPA is compiled by Maven at build time and served as static assets from within the Spring Boot container, with client-side routing handled by a `SpaController` forwarding to `index.html`. No separate frontend host or CORS proxy needed in production.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Browser — Angular 17 SPA                                           │
│  Standalone components · Lazy-loaded routes · Functional guards     │
│  HttpInterceptorFn (JWT injection + 401 auto-logout)                │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP (same origin in prod)
┌──────────────────────────▼──────────────────────────────────────────┐
│  Spring Boot 3.2 — REST API + Static File Server                    │
│  Spring Security (stateless JWT) · Global exception handler         │
│  Spring Data JPA — JOIN FETCH queries (N+1 eliminated)              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ JDBC
┌──────────────────────────▼──────────────────────────────────────────┐
│  MySQL 8                                                            │
│  Auto-schema via ddl-auto=update · Seeded on first boot             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Concern | Technology |
|---|---|
| **Backend framework** | Java 17, Spring Boot 3.2 |
| **Security** | Spring Security, JWT (jjwt 0.12.3), BCrypt |
| **Persistence** | Spring Data JPA, Hibernate, MySQL 8 |
| **Input validation** | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@NotNull`) |
| **Error handling** | `@RestControllerAdvice` global exception handler — structured JSON for 400 / 403 / 404 / 500 |
| **Frontend** | Angular 17 — standalone components, lazy-loaded routes, functional guards |
| **HTTP client** | Angular `HttpClient` with functional interceptors (`withInterceptors`) |
| **Styling** | Custom design system (CSS custom properties, Inter font, dark sidebar) |
| **Build** | Maven multi-module, `frontend-maven-plugin` — Angular compiled into the JAR |
| **Deployment** | Railway (`railway.toml`) — single service, MySQL plugin, env-var config |

---

## Feature Matrix

| Feature | Patient | Provider | Admin |
|---|:---:|:---:|:---:|
| Book & cancel appointments | ✅ | | |
| Confirm / complete appointments | | ✅ | ✅ |
| View own appointment history | ✅ | ✅ | ✅ |
| Create & edit prescriptions | | ✅ | |
| Send prescriptions to pharmacy | | ✅ | |
| Delete unsent prescriptions | | ✅ | |
| View own prescriptions | ✅ | | |
| Create invoices | | ✅ | ✅ |
| Pay invoices | ✅ | | |
| Submit insurance claims | ✅ | | |
| Override billing (mark paid) | | | ✅ |
| View & edit own health profile | ✅ | | |
| View all patient profiles | | ✅ | ✅ |
| User management dashboard | | | ✅ |
| Revenue reporting + CSV export | | | ✅ |

---

## Key Engineering Decisions

**N+1 query elimination** — All list endpoints use JPQL `JOIN FETCH` to load associations in a single query. `@Transactional(readOnly = true)` is applied to all read operations, enabling Hibernate to skip dirty-checking and the database to use read-optimized locks.

**Role enforcement is dual-layered** — Spring Security's `@PreAuthorize` / `hasRole()` enforces authorization at the method level on every controller. The Angular `authGuard` and `adminGuard` functional guards prevent unauthorized route access on the client, but the API is the source of truth.

**JWT is stateless and standards-compliant** — Tokens are signed with HMAC-SHA512, carry the user's role claim, and expire after 24 hours. The `JwtAuthFilter` validates on every request without touching the database if the token is still valid. A Spring Security `AuthenticationEntryPoint` ensures expired tokens return 401 (not 403) so the frontend interceptor can auto-redirect to `/login`.

**Single deployable artifact** — The `frontend-maven-plugin` downloads Node, runs `npm install` and `ng build` during `mvn package`, and the `maven-resources-plugin` copies the `dist/` output into `src/main/resources/static`. The `SpaController` forwards all non-API routes to `index.html`, so Angular's client-side router works correctly on page refresh.

**Registration auto-creates a Patient profile** — A new `PATIENT`-role account immediately gets a linked `Patient` entity within the same `@Transactional` boundary, so they can book appointments without a separate profile-creation step.

---

## Project Structure

```
healthcare-management-system/
├── backend/
│   └── src/main/java/com/hms/
│       ├── config/          # SecurityConfig, JwtUtil, JwtAuthFilter, DataSeeder, SpaController
│       ├── controller/      # AuthController, AppointmentController, PatientController,
│       │                    # PrescriptionController, InvoiceController, ReportController,
│       │                    # ProviderController, AdminController
│       ├── dto/             # Request / response DTOs (no entity leakage to API layer)
│       ├── exception/       # GlobalExceptionHandler (@RestControllerAdvice)
│       ├── model/           # JPA entities: User, Patient, Appointment, Prescription,
│       │                    # Invoice, Role, AppointmentStatus, InvoiceStatus
│       ├── repository/      # Spring Data repositories with JOIN FETCH JPQL
│       └── service/         # Business logic: AuthService, AppointmentService,
│                            # PatientService, PrescriptionService, InvoiceService, ReportService
│
├── frontend/
│   └── src/app/
│       ├── core/
│       │   ├── guards/          # authGuard, adminGuard (functional)
│       │   ├── interceptors/    # auth.interceptor.ts, error.interceptor.ts
│       │   ├── models/          # TypeScript interfaces matching backend DTOs
│       │   └── services/        # AppointmentService, InvoiceService, PrescriptionService, ...
│       ├── features/            # Dashboard, Appointments, Patients, Prescriptions,
│       │                        # Billing, Reports, Admin, Auth (login / register)
│       └── shared/              # NavbarComponent (sidebar)
│
├── railway.toml                 # Build + start commands for Railway
├── backend/src/main/resources/
│   ├── application.properties.example   # Local dev template (committed)
│   ├── application-prod.properties      # Railway env-var references (committed, no secrets)
│   └── application.properties           # Actual secrets — gitignored
└── pom.xml                              # Maven parent POM
```

---

## API Reference

All protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new account (auto-creates Patient profile) |
| `POST` | `/api/auth/login` | Public | Authenticate, receive JWT |
| `GET` | `/api/auth/health` | Public | Health check |
| `GET` | `/api/appointments` | Authenticated | Role-scoped: patient sees own, provider sees own, admin sees all |
| `POST` | `/api/appointments` | Patient | Book a new appointment |
| `PATCH` | `/api/appointments/{id}/status` | Provider / Admin | Confirm, complete, or cancel |
| `DELETE` | `/api/appointments/{id}` | Authenticated | Cancel appointment |
| `GET` | `/api/patients` | Authenticated | Role-scoped patient list |
| `GET` | `/api/patients/{id}` | Authenticated | Patient profile |
| `PUT` | `/api/patients/{id}` | Authenticated | Update patient profile |
| `GET` | `/api/prescriptions` | Authenticated | Role-scoped prescription list |
| `POST` | `/api/prescriptions` | Provider | Create prescription |
| `PUT` | `/api/prescriptions/{id}` | Provider | Edit prescription |
| `DELETE` | `/api/prescriptions/{id}` | Provider | Delete unsent prescription |
| `POST` | `/api/prescriptions/{id}/send` | Provider | Send to pharmacy |
| `GET` | `/api/invoices` | Authenticated | Role-scoped invoice list |
| `POST` | `/api/invoices` | Provider / Admin | Create invoice |
| `POST` | `/api/invoices/{id}/pay` | Patient / Admin | Mark as paid |
| `POST` | `/api/invoices/{id}/claim` | Patient | Submit insurance claim |
| `GET` | `/api/providers` | Authenticated | List providers for appointment booking |
| `GET` | `/api/admin/users` | Admin | All user accounts (no password hashes) |
| `GET` | `/api/reports` | Admin | Revenue and appointment analytics by date range |

---

## Running Locally

**Prerequisites:** Java 17+, Maven 3.8+, Node.js 20+, MySQL 8

```bash
git clone https://github.com/craft-b/healthcare-management-system
cd healthcare-management-system
```

Create `backend/src/main/resources/application.properties` (gitignored — never committed):

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/hsmdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false
app.jwt.secret=dev-secret-min-32-chars-change-in-production
app.jwt.expiration-ms=86400000
app.cors.allowed-origins=http://localhost:4200
```

```bash
# Terminal 1 — API
cd backend && mvn spring-boot:run

# Terminal 2 — Angular dev server (proxies /api/* → :8081)
cd frontend && npm install && npm start
```

Open [http://localhost:4200](http://localhost:4200). Demo data is seeded automatically on first boot.

---

## Deploying to Railway

The app ships as a **single Spring Boot JAR** — Angular is compiled by Maven and bundled into `src/main/resources/static`. No separate frontend service needed.

1. Connect this repository to a new Railway project
2. Add the **MySQL** database plugin — Railway injects connection env vars automatically
3. Set two environment variables on the service:

```
SPRING_PROFILES_ACTIVE = prod
JWT_SECRET             = <your-strong-random-secret>
```

Railway detects `railway.toml` and runs:

```
Build:  cd backend && mvn package -DskipTests
Start:  java -Dspring.profiles.active=prod -jar backend/target/hms-backend-0.0.1-SNAPSHOT.jar
```

---

## Demo Accounts

Seeded automatically on first startup.

| Role | Username | Password | Notes |
|---|---|---|---|
| Administrator | `admin` | `admin123` | Full system access |
| Provider | `dr.smith` | `doctor123` | Dr. Sarah Smith — Internal Medicine |
| Provider | `dr.jones` | `doctor123` | Dr. Michael Jones — General Practice |
| Provider | `dr.chen` | `doctor123` | Dr. Emily Chen — Cardiology |
| Provider | `dr.wilson` | `doctor123` | Dr. Robert Wilson — Orthopedics |
| Provider | `dr.martinez` | `doctor123` | Dr. Lisa Martinez — Neurology |
| Patient | `john.doe` | `patient123` | Full appointment & billing history |
| Patient | `jane.doe` | `patient123` | Diabetes management case |
| Patient | `michael.johnson` | `patient123` | Cardiology case |
| Patient | `sarah.williams` | `patient123` | |
| Patient | `robert.brown` | `patient123` | |
| Patient | `emily.davis` | `patient123` | |
| Patient | `david.miller` | `patient123` | |
| Patient | `jennifer.wilson` | `patient123` | |

---

<div align="center">

Built with Java · Spring Boot · Angular · MySQL

</div>
