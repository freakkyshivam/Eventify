# 🗓️ Event Management App (Eventify)

A full-stack **Event Management Platform** built with modern web technologies, featuring a premium dark-theme UI inspired by modern design systems. This platform allows users to discover, register for, and manage events, while providing organizers with powerful tools to host events and track revenue.

---

## ✨ Key Features

- **Passwordless Authentication & RBAC**: Seamless and secure login using **Google OAuth** and **Magic Links**, eliminating the need for passwords. Access is protected by JWT sessions with strict Role-Based Access Control (Admin, Organizer, Attendee).
- **Premium User Interface**: A cohesive, responsive dark theme utilizing Tailwind CSS v4, Radix UI primitives, featuring glassmorphism, gradient text, and micro-animations.
- **Dynamic Dashboards**: Route-based nested dashboards (`/dashboard`) tailored to each user role (Admin, Organizer, User) for managing events, registrations, user roles, and revenue.
- **Event Discovery & Management**: Users can browse and filter events, while organizers can create, edit, and safely manage event capacities and deadlines.
- **Automated Payments**: Seamless integration with Razorpay for secure paid event registrations.
- **Organizer Requests**: Attendees can request organizer privileges, which admins can review and approve directly from their customized dashboard.

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
| **React Hook Form & Zod** | Form management and UI schema validation |
| **Lucide React & Radix UI** | Lightweight icons and accessible unstyled UI primitives |

### Backend
| Tool / Package | Purpose |
| :--- | :--- |
| **Node.js & Express** | JavaScript runtime and web framework for the RESTful API |
| **PostgreSQL & Drizzle ORM** | Relational database and type-safe ORM for flexible data modeling |
| **Razorpay** | Payment gateway integration for secure event ticketing |
| **TypeScript** | Static typing extending to the backend |
| **Argon2 & JSONWebToken** | Security handling and authenticated session management |
| **Nodemailer** | Transporter for dispatching SMTP magic-link authentication emails |
| **Zod** | Runtime schema validation for API inputs |
| **Multer / Cloudinary** | Handling event banner image uploads (if configured) |

---

## 📂 Project Structure

```text
event-management/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Razorpay, and environment configuration
│   │   ├── controllers/     # API route handlers (auth, events, users, admin, payments)
│   │   ├── db/              # Drizzle ORM connection and schema definitions
│   │   ├── middlewares/     # Auth, RBAC, and error handling middleware
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic abstraction
│   │   ├── utils/           # Helpers (JWT generation, formatters, Nodemailer)
│   │   ├── validation/      # Zod validation schemas
│   │   └── server.ts        # Entry point
│   ├── drizzle.config.ts    # Drizzle ORM configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client instances and services organized by route
│   │   ├── components/      # Reusable UI components and nested dashboards
│   │   ├── hooks/           # Custom React hooks (e.g., Auth)
│   │   ├── pages/           # Top-level route components (Home, Events, EventDetails)
│   │   ├── types/           # TypeScript interfaces for API responses
│   │   ├── App.tsx          # Main application router
│   │   └── index.css        # Tailwind directives and global styles
│   └── package.json
├── DOCUMENTATION.md         # Comprehensive system documentation
└── README.md
```

---

## 🔐 Role-Based Access Control (RBAC)

- **User / Attendee (Default):** Can view public events, register/pay for events, and view their dashboard including payment history and tickets.
- **Organizer:** Can create events, edit their own events, track registrations, and view revenue analytics. Requires Admin approval via the `/dashboard` panel.
- **Admin:** Has full system oversight. Can manage all users, approve organizer requests, view platform-wide revenue, see all created events globally, and delete any event.

---

## 📝 Documentations

For detailed API guides, Database schema explanations, Payment flow Mermaid diagrams, and Environment prerequisites, please check the **[DOCUMENTATION.md](./DOCUMENTATION.md)** file!

---

*Built to demonstrate full-stack capabilities, secure payment flows, and mastery of modern UI design.*
