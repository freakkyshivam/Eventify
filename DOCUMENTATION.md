# Event Management Platform - Documentation

Welcome to the comprehensive internal documentation for **Eventify**, detailing frontend routes, backend architecture, schema designs, and important workflows.

---

## 1. Environment & Setup

### Prerequisites
- **Node.js**: v18+ 
- **Database**: PostgreSQL (Ensure you have a relational DB setup, preferably neon.tech, supabase, or local)
- **Payment Gateway**: Razorpay account for the test API keys

### Environment Variables
You need `.env` files in your both `/frontend` and `/backend` directories.

**Backend (`/backend/.env`)**:
```env
PORT=8000
DATABASE_URL="postgres://user:password@host/db"
JWT_SECRET="your-256-bit-secret"
FRONTEND_URL="http://localhost:5173"

# Razorpay Config
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_rzp_secret"

# Nodemailer / SMTP Config 
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"

# Optional Cloudinary Config (If uploading images)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

**Frontend (`/frontend/.env`)**:
```env
VITE_API_URL="http://localhost:8000/api/v1"
```

### Installation
1. Clone the project.
2. In `/backend`: run `npm install` followed by `npm run db:push` to sync your schema with Postgres. Start the server with `npm run dev`.
3. In `/frontend`: run `npm install` and then `npm run dev`.

---

## 2. Database Architectures (Drizzle ORM)

The backend utilizes **PostgreSQL** tied together with **Drizzle ORM**.

### 2.1 Users (`users`)
- **Fields**: `id` (UUID), `name`, `email` (Unique), `password`, `role` (Admin, Organizer, User), `created_at`.
- **Purpose**: Core identity store.

### 2.2 Events (`events`)
- **Fields**: `id`, `slug` (Unique), `title`, `description`, `details` (JSON), `event_category`, `is_paid`, `price`, `capacity`, `location`, `start_time`, `end_time`, `bannerUrls` (Array), `authorId` (Relation to `users`).
- **Purpose**: Defines an event object managed by an Organizer.

### 2.3 Event Registration (`event_registrations`)
- **Fields**: `id`, `user_id` (Relation), `event_id` (Relation), `registration_status` (Pending, Confirmed, Waiting, Cancelled), `ticket_code` (Unique), `registration_date`.
- **Purpose**: Binds a user to an event as a participant. It handles ticket generation constraints.

### 2.4 Payments (`payments`)
- **Fields**: `id`, `registration_id` (Relation), `amount`, `payment_status` (Pending, Completed, Failed), `razorpay_order_id`, `razorpay_payment_id`, `created_at`.
- **Purpose**: Keeps a ledger of the Razorpay transaction bindings.

### 2.5 Role Requests (`role_requests`)
- **Fields**: `id`, `user_id` (Relation), `status` (Pending, Approved, Rejected).
- **Purpose**: Stores the requests when a standard `User` wants to be elevated to an `Organizer`. Admin reviews this.

### 2.6 Magic Links & Sessions
- **`magic_links`**: Stores temporary token hashes utilized by the Nodemailer pipeline for passwordless email logins.
- **`sessions`**: Allows persistence tracking and remote logout handling by storing JWT generation events.

---

## 3. Workflows

### 3.1 Authentication (Magic Link)
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant SMTP as Nodemailer
    
    User->>Frontend: Enter Email
    Frontend->>Backend: POST /auth/magiclink { email }
    Backend->>Backend: Generate Secure Token<br>& Hash
    Backend->>SMTP: Send Email with Link<br>(Contains Token)
    SMTP-->>User: Delivers Email
    User->>Frontend: Clicks Link
    Frontend->>Backend: GET /auth/verify?token=XYZ
    Backend->>Backend: Validate Token Hash
    Backend->>Frontend: Returns JWT Tokens
    Frontend->>User: Logs In User
```

### 3.2 Event Paid Registration Flow (Razorpay)
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Razorpay

    User->>Frontend: Clicks "Register / Pay"
    Frontend->>Backend: POST /events/:id/register
    Backend->>Backend: Verify Capacity & User Status
    Backend->>Razorpay: Creates Order (Amount * 100)
    Razorpay-->>Backend: Returns order_id
    Backend->>Backend: Creates `event_registration` (Pending)<br>& `payment` (Pending)
    Backend-->>Frontend: Payload { order_id, amount, ... }
    Frontend->>Razorpay: Opens Razorpay Checkout UI
    User->>Razorpay: Completes Payment
    Razorpay-->>Frontend: Success Response (razorpay_payment_id, signature)
    Frontend->>Backend: POST /payment/verify
    Backend->>Backend: Verifies Signature (Crypto HMAC)
    Backend->>Backend: Updates Registration (Confirmed)<br>& Payment (Completed)
    Backend-->>Frontend: Verified = True
    Frontend->>User: Shows Ticket
```

### 3.3 Organizer Approval Process
1. **User Role**: Clicks "Become Organizer" inside the `/dashboard`.
2. **Backend**: Adds a row in `role_requests` mapping to the User's ID as `Pending`.
3. **Admin Dashboard**: Fetches `/admin/organizer-request`, seeing all `Pending` approvals.
4. **Admin Approval**: Clicks Approve. Backend updates `role_requests` to `Approved` and updates the `users` table `role = 'organizer'`. 
5. **Result**: The next time the User refreshes their session or navigates, the RBAC middleware identifies them as an Organizer and grants access to the `/dashboard` Organizer tabs.

---

## 4. Architectural Highlights

### Strict Next-Gen Routing (React Router v7)
The application leverages the absolute latest client-side routing capabilities. We have consolidated our layouts:
- `/dashboard` -> Routes globally but conditionally renders `<UserDashboard />`, `<OrganizerDashboard />` or `<AdminDashboard />` depending perfectly on the Redux/Auth Context roles fetched securely.
- nested routes handle `/events` vs `/events/:slug` intelligently to maximize caching UI frames.

### Tailwind v4 + Radix UI
By combining Tailwind CSS version 4 and Radix UI Unstyled primitives, the UI achieves a perfect balance of deep customization with Web Content Accessibility Guidelines (WCAG) standard keyboard navigations. We implement specific glassmorphism traits (`bg-[#0a0f16]/90 backdrop-blur-xl border border-white/5`), preventing CSS bleed and making animations hyper-fluid.
