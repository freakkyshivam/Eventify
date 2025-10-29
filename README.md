# 🗓️ Event Management App

A full-stack **Event Management Application** built with modern web technologies.  
This project helps users create, manage, and track events efficiently with a clean UI and fast performance.

---

## 🚀 Tech Stack

### Frontend
| Tool / Package                         | Purpose                                                                                  |
|---------------------------------------|------------------------------------------------------------------------------------------|
| [React](https://react.dev/)             | Build interactive, component-based UI                                                   |
| [Vite](https://vitejs.dev/)             | Fast development server and bundler                                                     |
| [Tailwind CSS](https://tailwindcss.com/)| Utility-first CSS framework for responsive and fast styling                              |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | Tailwind integration plugin for Vite                                                   |
| [TypeScript](https://www.typescriptlang.org/)| Adds static typing to JavaScript for safer and maintainable code                         |
| [React Router DOM](https://reactrouter.com/en/main) | Client-side routing for navigation                                                  |
| [Axios](https://axios-http.com/)        | HTTP client for API calls                                                                |
| [React Hook Form](https://react-hook-form.com/)| Form management and validation                                                      |
| [Zod](https://zod.dev/)                | Schema validation for form inputs and type safety                                       |
| [Lucide React](https://lucide.dev/)     | Lightweight icons for UI components                                                     |

### Backend
| Tool / Package          | Purpose / Use                                                                 |
|-------------------------|-------------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/) | JavaScript runtime for backend development                                  |
| [Express](https://expressjs.com/) | Web framework to handle routes, middleware, and APIs                        |
| [MongoDB](https://www.mongodb.com/) | NoSQL database to store events, users, and registrations                  |
| [Mongoose](https://mongoosejs.com/) | ODM to define schemas and interact with MongoDB                            |
| [dotenv](https://www.npmjs.com/package/dotenv) | Load environment variables from `.env` file                       |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | JWT authentication for secure routes                           |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing for secure storage                                   |
| [cors](https://www.npmjs.com/package/cors) | Handle cross-origin requests from frontend                                  |
| [helmet](https://www.npmjs.com/package/helmet) *(optional)* | Security headers for Express                                  |
| [morgan](https://www.npmjs.com/package/morgan) *(optional)* | HTTP request logging during development                          |
| [TypeScript](https://www.typescriptlang.org/) | Adds static typing to backend code                                        |
| [ts-node-dev](https://www.npmjs.com/package/ts-node-dev) | Hot reload for backend during development                                |
| `@types/*` packages      | Type definitions for TypeScript (Express, Node, JWT, etc.)                     |

---

## 📂 Project Structure

```
event-management/
├── backend/
│ ├
│ │── config/
│ │  └── db.ts
│ │── controllers/
│ │  ├── eventController.ts
│ │  └── userController.ts
│ │── middlewares/
│ │  └── authMiddleware.ts
│ │── models/
│ │  ├── Event.ts
│ │  └── User.ts
│ │── routes/
│ │  ├── eventRoutes.ts
│ │  └── userRoutes.ts
│ │── utils/
│ │  └── generateToken.ts
│ │── app.ts
│ │── server.ts
│ ├── tsconfig.json
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── utils/
│ │ ├── types/
│ │ ├── App.tsx
│ │ ├── main.tsx
│ │ └── index.css
│ ├── tailwind.config.js
│ ├── tsconfig.json
│ ├── package.json
│ └── vite.config.ts
│
├── docs/
│ └── tools-usage.md
├── .env
└── README.md
```


---

## 🛠️ Installation & Setup

### Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run development server
npm run dev


# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

```

# Important installation guide

    ```bash
    # Install TypeScript and ts-node-dev
    npm install -D typescript ts-node-dev

    # Initialize TypeScript configuration
    npx tsc --init

    npm install -D @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/morgan

    ```


| Method | Endpoint             | Description      | Access |
| ------ | -------------------- | ---------------- | ------ |
| POST   | `/api/auth/register` | User signup      | Public |
| POST   | `/api/auth/login`    | User login       | Public |
| GET    | `/api/events`        | Get all events   | Public |
| GET    | `/api/events/:id`    | Get single event | Public |
| POST   | `/api/events`        | Create event     | Admin  |
| PUT    | `/api/events/:id`    | Update event     | Admin  |
| DELETE | `/api/events/:id`    | Delete event     | Admin  |
