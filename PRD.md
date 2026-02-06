# 📄 Product Requirements Document (PRD)
## Event Management Platform

---

## 1. 📌 Overview
This project is a backend-focused Event Management Platform built to learn and demonstrate:
- Authentication & Authorization (RBAC)
- Event lifecycle management
- Secure payment flow
- Real-world backend design decisions

The primary goal is **to finish a production-sensible MVP within 7 days**, not to overengineer.

---

## 2. 🎯 Objectives
- Implement secure role-based access control
- Allow organizers to create and manage events
- Allow users to join paid events
- Restrict access based on role, ownership, and payment status
- Deliver a fully working, deployable backend

---

## 3. 👥 User Roles

### 3.1 ADMIN
- Created manually via DB seed or migration
- Has full system access

**Permissions:**
- Promote users to ORGANIZER
- Demote organizers (optional)
- View all users and events

---

### 3.2 ORGANIZER
- Promoted by ADMIN
- Owns and manages their events

**Permissions:**
- Create events
- Update/delete own events
- View participants of own events

---

### 3.3 USER
- Registers publicly
- Can participate in events

**Permissions:**
- View events
- Join events
- Make payments
- Access joined/paid events only

---

## 4. 🔐 Authentication & Authorization

### 4.1 Authentication
- JWT-based authentication
- Auth middleware validates token and attaches user to request

---

### 4.2 Authorization (RBAC)
- Role stored directly on `users` table
- Roles:
  - ADMIN
  - ORGANIZER
  - USER
- Role checks done using middleware at route level

RBAC does NOT handle ownership. Ownership is checked separately.

---

## 5. 🧱 Core Entities (Database Models)

### 5.1 User
- id
- name
- email
- password
- role (ADMIN | ORGANIZER | USER)
- created_at

---

### 5.2 Event
- id
- title
- description
- price
- date
- created_by (ORGANIZER user id)
- created_at

---

### 5.3 Event Participants
- id
- user_id
- event_id
- status (JOINED | PAID)
- joined_at

---

### 5.4 Payment
- id
- user_id
- event_id
- amount
- status (SUCCESS | FAILED)
- provider_payment_id
- created_at

---

## 6. 🔁 User Flows

### 6.1 User Registration
- Public registration
- Role is always USER (forced by backend)

---

### 6.2 Organizer Promotion
- ADMIN promotes user to ORGANIZER
- No self-promotion allowed

---

### 6.3 Event Creation
- ORGANIZER creates event
- Event is linked to organizer via `created_by`

---

### 6.4 Event Joining & Payment
1. USER selects event
2. Backend creates payment order
3. Payment success webhook
4. Payment saved in DB
5. User marked as PAID participant
6. Event access unlocked

---

## 7. 💳 Payment System

### Scope (STRICT):
- One-time payment per event
- No refunds
- No coupons
- No retries logic

Payment is considered
