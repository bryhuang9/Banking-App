# Software Requirements Specification (SRS)
# Bank Dashboard Application

**Version:** 1.0  
**Date:** October 27, 2025  
**Status:** Initial Draft  

---

## 1. Purpose

The purpose of this project is to build a modern, responsive, production-worthy bank dashboard web application using a challenging tech stack. The goal is to implement all UI/UX features and expand them with realistic backend functionality (authentication, data persistence, role-based access, REST/GraphQL API, testing, deployment) so that the resulting project can be shown on your résumé as a "full-stack production-style application".

**Tech Stack:**
- **Frontend:** React + TypeScript + Redux Toolkit + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **API:** RESTful (with option for GraphQL)
- **DevOps:** Docker, Docker Compose, CI/CD (GitHub Actions)
- **Testing:** Jest, Supertest, Cypress

---

## 2. Scope

### In Scope
- Web dashboard where bank users and admins can log in
- View account summary, transaction list, analytics (charts)
- Manage cards, transfer money
- Responsive design (desktop & mobile)
- Secure authentication (JWT)
- Backend APIs to serve user, account, transaction data
- Data persistence layer (PostgreSQL)
- Deployment to cloud via containers (Docker) and CI/CD

### Out of Scope
- Real banking system integration
- Actual financial transactions
- Regulatory compliance (PCI-DSS, etc.)
- Mobile native apps (web responsive only)

---

## 3. Definitions, Acronyms, Abbreviations

| Term | Definition |
|------|------------|
| UI | User Interface |
| UX | User Experience |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
| GraphQL | Query language for APIs |
| SPA | Single Page Application |
| DB | Database |
| RBAC | Role Based Access Control |
| ORM | Object-Relational Mapping |

---

## 4. Overall Description

### 4.1 Product Perspective

This dashboard is part of a hypothetical online banking system. The project focuses on the dashboard interface and related APIs. It integrates a front-end SPA with top-level navigation: **Overview**, **Transactions**, **Analytics**, **Cards**, **Settings**. The backend exposes REST endpoints to fetch user profile, account balances, cards, transactions, perform transfers, etc.

### 4.2 Product Functions

1. **User registration & login/logout**
2. **Dashboard:** Display account summary (balance, cards, etc.)
3. **Transactions list:** View recent transactions, filter/search, categorize
4. **Analytics:** Charts of spending, income, categories
5. **Cards management:** List cards, toggle active/inactive, request new card
6. **Money transfer:** From one sub-account to another (or external)
7. **Settings:** User profile, theme (light/dark), security settings
8. **Admin role (optional):** User management, system overview

### 4.3 User Classes and Characteristics

| User Type | Description | Characteristics |
|-----------|-------------|-----------------|
| **End User (Customer)** | Regular bank customer | Uses dashboard to view and manage accounts. Moderate technical literacy, expects security and responsive UI |
| **Admin User (Bank Staff)** | Bank staff member | Can view overview of multiple accounts, manage users. Moderate technical literacy |
| **Guest** | Unauthenticated visitor | Before login, sees landing page or login prompt |

### 4.4 Operating Environment

- **Web Browsers:** Latest versions of Chrome, Firefox, Edge, Safari
- **Responsive:** Desktop and mobile devices
- **Backend:** Node.js runtime, containerized (Docker)
- **Database:** PostgreSQL (managed service or container)
- **Hosting:** Cloud VM/container (AWS/GCP/Azure/DigitalOcean)
- **Local Development:** Mac/Windows/Linux

### 4.5 Design and Implementation Constraints

- Must use React with TypeScript and Redux Toolkit
- UI must use Tailwind CSS
- Backend must implement JWT authentication and authorization
- API endpoints must be documented (OpenAPI/Swagger)
- Database schema must include migrations
- Application must be containerized (Docker)
- CI/CD pipeline must run tests, linting, build images
- Code must be version-controlled (Git)

### 4.6 Assumptions and Dependencies

- Access to cloud account for deployment
- Use of public open-source packages
- No real banking system integration required
- Sample/mock data for transactions and accounts
- Node.js v18+, React v18+
- Docker available for containerization

---

## 5. Functional Requirements

### FR1 – User Authentication

| ID | Requirement |
|----|-------------|
| FR1.1 | The system shall allow users to register with email and password |
| FR1.2 | The system shall allow users to log in and receive a JWT |
| FR1.3 | The system shall allow users to log out (invalidate token or client-side removal) |
| FR1.4 | The system shall allow password reset via email link (optional) |
| FR1.5 | The system shall support role-based access: standard user, admin |

### FR2 – Dashboard Overview

| ID | Requirement |
|----|-------------|
| FR2.1 | Upon login, user shall see account summary: total balance across accounts, recent cards |
| FR2.2 | User shall see a list of their cards (credit/debit) and their status (active/inactive) |
| FR2.3 | User shall see recent transactions aggregated and key metrics (income vs spending) |

### FR3 – Transactions Module

| ID | Requirement |
|----|-------------|
| FR3.1 | User shall view a paginated list of transactions (date, description, amount, category) |
| FR3.2 | User shall filter transactions by date range, category, amount (min/max) |
| FR3.3 | User shall search transactions by description keyword |
| FR3.4 | User may click a transaction to view detailed info |
| FR3.5 | User may categorize or rename transactions (optional advanced) |

### FR4 – Analytics / Charts Module

| ID | Requirement |
|----|-------------|
| FR4.1 | User shall see charts showing spending per category over time (e.g., bar chart monthly) |
| FR4.2 | User shall see income vs spending pie chart for current month |
| FR4.3 | User shall toggle between time periods (last week, month, year) |

### FR5 – Cards Management

| ID | Requirement |
|----|-------------|
| FR5.1 | User shall view list of cards with details (card number masked, expiry, balance, status) |
| FR5.2 | User shall toggle a card's active/inactive status |
| FR5.3 | User shall request a new card (simulate new card creation) |
| FR5.4 | User shall view detailed card view (transactions for that card) |

### FR6 – Money Transfer Module

| ID | Requirement |
|----|-------------|
| FR6.1 | User shall initiate a transfer between accounts (e.g., from checking to savings) |
| FR6.2 | User shall initiate a transfer to an external account (simulate) |
| FR6.3 | System shall validate sufficient balance and show success/failure message |
| FR6.4 | System shall write a transaction log for transfers (incoming and outgoing) |

### FR7 – Settings / Profile

| ID | Requirement |
|----|-------------|
| FR7.1 | User shall view and edit their profile (name, email, phone) |
| FR7.2 | User shall change password |
| FR7.3 | User shall toggle theme (light/dark) |
| FR7.4 | Admin shall access a user-management page (view list of users, deactivate users) |

### FR8 – Admin Module (Optional)

| ID | Requirement |
|----|-------------|
| FR8.1 | Admin shall view dashboard of total users, total transfer volume |
| FR8.2 | Admin shall search for any user account and view their accounts & transactions |
| FR8.3 | Admin shall deactivate/reactivate user accounts |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR1 | Performance | Dashboard must load initial data within 2 seconds. Frontend interactions respond within 300ms |
| NFR2 | Scalability | Architecture should support horizontal scaling of API server and DB |
| NFR3 | Security | Use HTTPS, hash passwords (bcrypt), protect endpoints via JWT, input validation |
| NFR4 | Usability | UI must be responsive and accessible (keyboard navigation, ARIA labels) |
| NFR5 | Maintainability | Code follows style guidelines (linting), modular, documented |
| NFR6 | Deployability | System containerized (Docker) with CI/CD pipeline |
| NFR7 | Logging & Monitoring | Backend logs errors and metrics; deployment includes monitoring |
| NFR8 | Availability | Target 99.9% availability |
| NFR9 | Backup & Recovery | Database backups performed |

---

## 7. External Interface Requirements

### 7.1 User Interfaces

- Login/Register forms
- Dashboard overview page
- Transactions list page
- Transaction detail modal
- Analytics page with charts
- Cards management page
- Transfer form page
- Settings/profile page
- Admin pages

### 7.2 API Interfaces

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed endpoint specifications.

### 7.3 Hardware Interfaces

None beyond typical web server/database host.

### 7.4 Software Interfaces

- Database: PostgreSQL
- ORM: Prisma
- External email service (for password reset)
- CI/CD: GitHub Actions
- Container runtime: Docker

### 7.5 Communications Interfaces

- HTTPS (TLS)
- WebSocket (optional for real-time updates)

---

## 8. Data Requirements

### 8.1 Data Entities

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema.

**Core Entities:**
- User
- Account
- Card
- Transaction
- Transfer

### 8.2 Data Flows

1. **Login Flow:** User credentials → Auth validation → JWT token → User profile + accounts + cards
2. **Transaction Filter:** Filter params → Backend query → Filtered transactions
3. **Transfer Flow:** Transfer request → Validation → Account updates → Transaction logs → Response
4. **Card Toggle:** Status change request → DB update → Updated card status

---

## 9. System Architecture

### 9.1 High-Level Architecture

```
┌─────────────────┐
│   React SPA     │
│  (TypeScript)   │
│  Redux Toolkit  │
│  Tailwind CSS   │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────┐
│  Express API    │
│  (TypeScript)   │
│   JWT Auth      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│  (Prisma ORM)   │
└─────────────────┘
```

### 9.2 Technology Stack

- **Frontend:** React 18+, TypeScript, Redux Toolkit, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT with bcrypt password hashing
- **Testing:** Jest, Supertest, Cypress
- **DevOps:** Docker, Docker Compose, GitHub Actions
- **Deployment:** Cloud platform (AWS/GCP/DigitalOcean)

### 9.3 Security Architecture

- JWT for authentication
- Passwords hashed with bcrypt (10 rounds)
- Protected endpoints with middleware
- HTTPS in production
- CORS policies configured
- Input validation & sanitization
- Environment variables for secrets

---

## 10. Project Phases & Timeline

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed SDLC plan.

**Summary:**
- **Phase 0:** Setup & Planning (1-2 days)
- **Phase 1:** Backend Core (1 week)
- **Phase 2:** Frontend Core (1 week)
- **Phase 3:** Transactions & Analytics (1 week)
- **Phase 4:** Transfer & Cards (1 week)
- **Phase 5:** Settings & Admin (1 week)
- **Phase 6:** QA & Hardening (1 week)
- **Phase 7:** Deployment (2-3 days)
- **Phase 8:** Polish & Extras (Variable)

**Total:** 4-5 weeks full-time, 8-10 weeks part-time

---

## 11. Acceptance Criteria

The project is complete when:

- [ ] All functional requirements (FR1-FR8) are implemented
- [ ] All non-functional requirements (NFR1-NFR9) are met
- [ ] Unit test coverage > 70%
- [ ] Integration tests pass for all API endpoints
- [ ] E2E tests cover critical user flows
- [ ] Application deployed and accessible via public URL
- [ ] Documentation complete (README, API docs, architecture)
- [ ] CI/CD pipeline functional
- [ ] Security audit passed (no critical vulnerabilities)
- [ ] Performance benchmarks met

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-27 | Brian | Initial SRS document created |

---

## 13. References

- [Project Structure](./PROJECT_STRUCTURE.md)
- [API Endpoints](./API_ENDPOINTS.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Component Hierarchy](./COMPONENT_HIERARCHY.md)
- [Project Plan](./PROJECT_PLAN.md)
