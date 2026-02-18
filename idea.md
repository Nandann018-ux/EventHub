# EventHub

## 1. Project Overview
EventHub is a full-stack web application built using **TypeScript (Node.js + Express)** for managing events and participant registrations in a structured and scalable way.

The platform allows administrators to create and manage events, while users can browse and register for events within defined capacity limits.

The primary focus of this project is strong backend engineering using TypeScript to enforce type safety, maintainability, and proper implementation of Object-Oriented Programming (OOP) principles.

---

## 2. Technology Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB / PostgreSQL
- Prisma ORM / Mongoose
- JWT Authentication

### Frontend
- React (TypeScript preferred)

---

## 3. Problem Statement

In many colleges and organizations, event registration is managed manually through spreadsheets or simple forms. This often causes:

- Overbooking beyond capacity
- Poor participant tracking
- No structured registration lifecycle
- Lack of scalability
- No proper role-based control

A backend-driven, strongly typed system is required to enforce business rules such as capacity constraints, role-based access, and lifecycle management.

---

## 4. Solution Approach

EventHub is designed using a layered architecture in TypeScript:

Controller → Service → Repository → Database

Key backend principles:

- Strong typing using TypeScript interfaces and DTOs
- Encapsulation of business logic inside service classes
- Repository pattern for database interaction
- Transaction handling to prevent overbooking
- Defined registration state transitions

---

## 5. Core Features

### 5.1 User Management

- Secure user registration and login (JWT-based)
- Role-based access (Admin / User)
- Profile management

### 5.2 Event Management (Admin)

- Create event with:
  - Title
  - Description
  - Date & time
  - Venue
  - Maximum capacity
- Update or cancel events
- View participant list
- Mark attendance

### 5.3 Registration System (User)

- Browse available events
- Register for event (only if capacity available)
- Cancel registration
- View registration status

---

## 6. Business Logic Enforcement

### Capacity Validation

Before creating a registration:

- System checks current confirmed registrations
- If capacity reached → registration blocked
- Database transaction ensures no race conditions

### Registration Lifecycle

Each registration follows this state flow:

REGISTERED → CONFIRMED → CANCELLED → ATTENDED

State transitions are handled strictly inside the Service layer.

---

## 7. OOP Implementation in TypeScript

The backend will demonstrate:

### Encapsulation
Business logic contained inside service classes:

- EventService
- RegistrationService
- UserService

### Abstraction
Repository interfaces define database operations:

- IEventRepository
- IRegistrationRepository
- IUserRepository

### Inheritance
BaseUser class extended by:

- AdminUser
- NormalUser

### Polymorphism
Different event types (OnlineEvent / OfflineEvent) implementing a common interface.

---

## 8. Non-Functional Requirements

- Scalability: Handle concurrent registrations safely.
- Consistency: Prevent oversubscription using transactions.
- Security: JWT authentication and role-based authorization.
- Maintainability: Modular structure with strict typing.
- Performance: Efficient database queries and indexing.

---

## 9. Project Structure (Backend)

src/
  controllers/
  services/
  repositories/
  models/
  interfaces/
  middlewares/
  routes/
  utils/

---

## 10. Future Enhancements

- Waitlist automation
- Email notifications
- Event analytics dashboard
- QR-based attendance tracking
- Payment integration
- Multi-organization support

---

## 11. Conclusion

EventHub is a TypeScript-based full-stack application focused on clean architecture, strong backend logic, and proper implementation of OOP principles.

The project is scalable and extensible, making it suitable for semester-long evaluation and incremental enhancement.
