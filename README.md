# 🗓️ Event Management App (Eventify)

A full-stack **Event Management Platform** built with modern web technologies, featuring a premium dark-theme UI inspired by modern design systems. This platform allows users to discover, register for, and manage events, while providing organizers with powerful tools to host events and track revenue.

---

## ✨ Key Features

- **Passwordless Authentication & RBAC**: Seamless and secure login using **Google OAuth** and **Magic Links**, eliminating the need for passwords. Access is protected by JWT sessions with strict Role-Based Access Control (Admin, Organizer, Attendee).
- **Premium User Interface**: A cohesive, responsive dark theme utilizing Tailwind CSS, featuring glassmorphism, gradient text, and micro-animations.
- **Dynamic Dashboards**: Route-based nested dashboards (`/dashboard/:tab`) tailored to each user role for managing events, registrations, and revenue.
- **Event Discovery & Management**: Users can browse and filter events, while organizers can create, edit, and safely manage event capacities and deadlines.
- **Automated Payments**: Seamless integration with Razorpay for secure paid event registrations.
- **Organizer Requests**: Attendees can request organizer privileges, which admins can review and approve directly from their dashboard.

---

## 🚀 Tech Stack

### Frontend
| Tool / Package | Purpose |
| :--- | :--- |
| **React 19** | Interactive, component-based UI |
| **Vite** | Fast development server and bundler |
| **Tailwind CSS v4** | Utility-first CSS framework for styling the premium dark theme |
| **TypeScript** | Static typing for safer and maintainable code |
| **React Router v7** | Client-side routing for navigation and nested dashboards |
| **Axios** | HTTP client for all API interactions |
| **React Hook Form & Zod** | Form management and schema validation |
| **Lucide React** | Lightweight, consistent iconography |

### Backend
| Tool / Package | Purpose |
| :--- | :--- |
| **Node.js & Express** | JavaScript runtime and web framework for the RESTful API |
| **PostgreSQL & Drizzle ORM** | Relational database and type-safe ORM for flexible data modeling |
| **Razorpay** | Payment gateway integration for event ticketing |
| **TypeScript** | Static typing extending to the backend |
| **Multer / Cloudinary** | Handling event banner image uploads (if configured) |
| **Zod** | Runtime schema validation for API inputs |

---

## 📂 Project Structure

```text
event-management/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, and environment configuration
│   │   ├── controllers/     # API route handlers (auth, events, users, payments)
│   │   ├── db/              # Drizzle ORM connection and schema definitions
│   │   ├── middlewares/     # Auth, RBAC, and error handling middleware
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic abstraction
│   │   ├── utils/           # Helpers (JWT generation, formatters)
│   │   ├── validation/      # Zod validation schemas
│   │   └── server.ts        # Entry point
│   ├── drizzle.config.ts    # Drizzle ORM configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client instances and services
│   │   ├── components/      # Reusable UI components and nested dashboards
│   │   ├── hooks/           # Custom React hooks (e.g., useAuth)
│   │   ├── pages/           # Top-level route components (Home, Events, EventDetails)
│   │   ├── types/           # TypeScript interfaces for API responses
│   │   ├── App.tsx          # Main application router
│   │   └── index.css        # Tailwind directives and global styles
│   └── package.json
└── README.md
```

---

 
## 🔐 Role-Based Access Control (RBAC)

- **Attendee (Default):** Can view public events, register/pay for events, and view their digital tickets.
- **Organizer:** Can create events, edit their own events, track registrations, and view revenue analytics. Requires Admin approval.
- **Admin:** Has full system oversight. Can manage all users, approve organizer requests, view platform-wide revenue, and delete any event.

---

## 📝 API Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/auth/google` | Google OAuth login/signup | Public |
| `POST` | `/api/v1/auth/magiclink` | Request magic link login email | Public |
| `GET` | `/api/v1/auth/verify`| Verify magic link token | Public |
| `POST` | `/api/v1/auth/logout` | User logout | Authenticated |
| `GET` | `/api/v1/events` | List all events | Public |
| `GET` | `/api/v1/events/:slug` | Get event details by slug | Public |
| `POST` | `/api/v1/events` | Create a new event | Organizer / Admin |
| `POST` | `/api/v1/events/:eventId` | Register for event (Creates Razorpay Order) | Authenticated |
| `POST` | `/api/v1/payment/verify`| Verify payment & confirm registration | Authenticated |

---

*Built to demonstrate full-stack capabilities, secure payment flows, and mastery of modern UI design.*
