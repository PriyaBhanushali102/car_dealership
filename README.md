# Precision Auto — Car Dealership Inventory System

🔗 **Live Demo:** https://car-dealership-wine.vercel.app
📦 **Backend API:** https://car-dealership-dozs.onrender.com

## Overview

A full-stack **Car Dealership Inventory System** built as a TDD kata. The backend provides a RESTful API with JWT authentication, complete vehicle CRUD, inventory search, and purchase/restock operations. The frontend is a React + Tailwind CSS SPA for browsing, searching, purchasing, and (for admins) managing the full vehicle inventory.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Setup & Run Locally](#setup--run-locally)
- [Running Tests](#running-tests)
- [Test Report](#test-report)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Optional Deployment](#optional-deployment)

---

## Project Overview

**Precision Auto** is a dealership inventory management platform that allows:

- Staff and customers to **register and log in** using secure JWT-based authentication
- All authenticated users to **browse and search** the vehicle inventory by make, model, category, or price range
- Users to **purchase vehicles** (stock decreases by 1; button auto-disables when quantity reaches 0)
- **Admins** to add, update, delete, and restock vehicles through a fully protected admin interface

Development followed **Test-Driven Development (Red → Green → Refactor)** with clear, descriptive Git commits that narrate the build journey, and transparent AI co-authorship on every AI-assisted commit.

---

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Backend  | Node.js, Express.js                            |
| Database | MongoDB (Atlas or local) via Mongoose          |
| Auth     | JWT (`jsonwebtoken`), bcryptjs                 |
| Testing  | Jest, Supertest                                |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7 |
| HTTP     | Axios                                          |

---

## Features

### Backend ✅

- [x] User registration — `POST /api/auth/register`
- [x] User login — `POST /api/auth/login`
- [x] Get current user — `GET /api/auth/me`
- [x] JWT protection middleware (`protect`) on all vehicle routes
- [x] Admin-only guard (`adminOnly`) on delete and restock
- [x] Create vehicle — `POST /api/vehicles`
- [x] List all vehicles — `GET /api/vehicles`
- [x] Search vehicles by make, model, category, price range — `GET /api/vehicles/search`
- [x] Update vehicle — `PUT /api/vehicles/:id`
- [x] Delete vehicle (admin only) — `DELETE /api/vehicles/:id`
- [x] Purchase vehicle (decreases quantity by 1) — `POST /api/vehicles/:id/purchase`
- [x] Restock vehicle (admin only, increases quantity) — `POST /api/vehicles/:id/restock`
- [x] Global error handling middleware
- [x] Async error utility (`asyncHandler` + `AppError`)
- [x] Database seeder with pre-seeded admin and user accounts

### Frontend ✅

- [x] User registration form
- [x] User login form
- [x] Vehicle dashboard — displays all available vehicles in a responsive grid
- [x] Stats bar — total vehicles, in-stock, out-of-stock, categories count
- [x] Search and filter bar — filter by make, model, category, min/max price
- [x] Vehicle cards with category badges and live stock status badges
- [x] **Purchase button** — disabled and shows "Out of Stock" when `quantity === 0`
- [x] Admin: Add vehicle (modal form)
- [x] Admin: Edit vehicle (modal form pre-filled)
- [x] Admin: Delete vehicle (confirm modal)
- [x] Admin: **Restock vehicle** — inline quantity stepper on each card (+ / − controls)
- [x] Toast notifications for all actions
- [x] Fully responsive layout (mobile → desktop)

---

## API Endpoints

### Auth (Public)

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login, receive JWT      |
| GET    | `/api/auth/me`       | Get current user (auth) |

### Vehicles (Protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint                     | Role  | Description                   |
| ------ | ---------------------------- | ----- | ----------------------------- |
| POST   | `/api/vehicles`              | User  | Add a new vehicle             |
| GET    | `/api/vehicles`              | User  | List all vehicles             |
| GET    | `/api/vehicles/search`       | User  | Search / filter vehicles      |
| PUT    | `/api/vehicles/:id`          | User  | Update vehicle details        |
| DELETE | `/api/vehicles/:id`          | Admin | Delete a vehicle              |
| POST   | `/api/vehicles/:id/purchase` | User  | Purchase — decreases quantity |
| POST   | `/api/vehicles/:id/restock`  | Admin | Restock — increases quantity  |

### Vehicle Object Schema

```json
{
  "_id": "ObjectId (auto)",
  "make": "string (required)",
  "model": "string (required)",
  "category": "Sedan | SUV | Hatchback | Truck | Coupe | Convertible",
  "price": "number (required, min 0)",
  "quantity": "number (required, min 0)",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

## Project Structure

```
car_dealership/
├── README.md
├── PROMPTS.md
├── backend/
│   ├── app.js                  # Express app, routes, middleware
│   ├── server.js               # Entry point, DB connection
│   ├── package.json
│   ├── .env                    # Not committed — create locally
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── vehicleController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect
│   │   ├── adminMiddleware.js  # adminOnly guard
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Vehicle.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── vehicleRoutes.js
│   ├── seeder/
│   │   └── seedUsers.js
│   ├── tests/
│   │   ├── app.test.js
│   │   ├── auth.test.js
│   │   └── vehicles.test.js
│   └── utils/
│       ├── asyncHandler.js
│       └── AppError.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axiosInstance.js
        ├── components/
        │   ├── Header.jsx
        │   ├── LoginForm.jsx
        │   ├── RegisterForm.jsx
        │   ├── VehicleCard.jsx      # Purchase + admin Edit/Delete/Restock
        │   ├── VehicleFormModal.jsx
        │   ├── DeleteConfirmModal.jsx
        │   └── SearchFilterBar.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── VehicleContext.jsx
        │   └── ToastContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        └── services/
            ├── authService.js
            └── vehicleService.js
```

---

## Setup & Run Locally

### Prerequisites

- Node.js 18+ (tested with v22)
- npm
- A MongoDB database — [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or a local MongoDB instance

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd car_dealership
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>
JWT_SECRET=your_strong_secret_here
JWT_EXPIRATION=1d
CORS_ORIGIN=http://localhost:5174
```

---

### 3. Seed the database (optional but recommended)

```bash
npm run seed
```

Pre-seeded accounts:

| Email          | Password  | Role  |
| -------------- | --------- | ----- |
| admin@test.com | admin1234 | admin |
| john@test.com  | john1234  | user  |
| alice@test.com | alice1234 | user  |

---

### 4. Start the backend

```bash
# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

API base URL: `http://localhost:5000`

---

### 5. Frontend setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite — typically `http://localhost:5173`.

---

## Running Tests

All tests live in `backend/tests/`. They connect to a real MongoDB database (configured via `MONGO_URI` in `.env`).

```bash
cd backend
npm test
```

Run a single suite:

```bash
npm test -- tests/auth.test.js
npm test -- tests/vehicles.test.js
npm test -- tests/app.test.js
```

---

## Test Report

See `TEST_REPORT.md` for the captured test run output, diagnosis, and reproduction steps.

Summary (latest run captured 2026-07-23):

- Test Suites: 1 failed, 2 passed, 3 total
- Tests: 15 failed, 4 passed, 19 total
- Key issue: Jest hook timeouts while connecting to MongoDB (see `TEST_REPORT.md`)

If you fixed the DB connection and re-ran tests successfully, update this section with the new passing summary and timestamp.

### Test Coverage by Suite

| Suite              | Test Cases                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.test.js`      | `GET /` health check returns 200                                                                                                                                                                                          |
| `auth.test.js`     | Register new user (201), duplicate email rejected (400), login with valid credentials (200)                                                                                                                               |
| `vehicles.test.js` | 401 without token; create vehicle (201); get all (200); update (200) + 404; delete admin (200) + 404; search by make + empty result; purchase (200) + out-of-stock (400) + 404; restock admin (200) + non-admin 403 + 404 |

### TDD Commit Pattern (Red → Green → Refactor)

Each feature was test-driven. Example from the commit history:

```
a470d37  test(vehicle): add failing tests for create and get vehicles APIs   ← RED
8995c6b  feat(vehicle): implement create and get vehicles APIs               ← GREEN

b2359a7  test(vehicle): add failing tests for vehicle update scenarios       ← RED
b9dd7bf  feat(vehicle): implement update vehicle API with not-found handling ← GREEN

32d942b  test(vehicle): add failing tests for vehicle deletion API           ← RED
dcb6f09  feat(vehicle): add vehicle deletion controller                      ← GREEN

f12579d  test(vehicle): add failing tests for vehicle search endpoint        ← RED
26f6b79  feat(vehicle): implement vehicle search endpoint                    ← GREEN

385b3fe  test(vehicle): add failing tests for vehicle purchase endpoint      ← RED
50fe506  feat(vehicle): implement vehicle purchase endpoint                  ← GREEN

a7068bc  test(vehicle): add failing tests for vehicle restock endpoint       ← RED
93faee5  feat(vehicle): implement vehicle restock endpoint with admin auth   ← GREEN
```

---

## Screenshots

> Run `npm run dev` in both `backend/` and `frontend/` then open `http://localhost:5173`.

| Screen               | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Login page           | Auth form with violet gradient, error feedback                     |
| Register page        | Account creation form                                              |
| Vehicle dashboard    | Grid of all vehicles with stats bar and search bar                 |
| Vehicle card (user)  | Category badge, stock badge, Purchase button (disabled when qty=0) |
| Vehicle card (admin) | Edit / Delete / Restock inline stepper                             |
| Search & filter      | Filter by make, model, category, min/max price                     |
| Add / Edit modal     | Admin vehicle form modal                                           |
| Delete confirm       | Admin delete confirmation modal                                    |
| Restock panel        | Inline +/− quantity stepper with Confirm button                    |

_Add screenshots to `docs/screenshots/` and link them here._

---

## My AI Usage

### Which AI tools were used

| Tool                            | Purpose                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Cursor**                      | Primary IDE AI (Composer / Agent mode) — used throughout                                                  |
| **ChatGPT**                     | Used in earlier sessions for TDD planning and code review                                                 |
| **Google Antigravity (Gemini)** | Used for final project audit, restock UI implementation, dependency cleanup, and README/PROMPTS authoring |

---

### How AI was used

1. **TDD planning** — Asked ChatGPT to list meaningful test cases for each endpoint (401/403/404/400/200/201 scenarios) before writing a single line of implementation
2. **Boilerplate scaffolding** — Used Cursor Agent to generate the initial `vehicleController.js`, `vehicleRoutes.js`, and `vehicles.test.js` following existing auth patterns
3. **Debugging test failures** — Diagnosed `PATCH` vs `PUT` route mismatch, stale test assertions (expected 200, received 201), and MongoDB connection issues
4. **Middleware review** — ChatGPT reviewed `adminOnly` and `protect` middleware structure and error handling
5. **Frontend scaffolding** — Cursor generated `VehicleCard`, `VehicleFormModal`, `DeleteConfirmModal`, `SearchFilterBar` components and wired them into the `VehicleContext`
6. **Restock UI** — Gemini (Antigravity) implemented the full admin Restock flow: inline quantity stepper in `VehicleCard`, `restockVehicle` in context, handler in `Dashboard`
7. **Project audit** — Gemini performed a full compliance audit against the kata requirements and identified the PATCH/PUT bug, missing restock UI, stale docs, and nodemon dependency gap
8. **Dependency cleanup** — Gemini removed conflicting `cloudinary` / `multer-storage-cloudinary` packages and added `nodemon` to `devDependencies`
9. **Documentation** — This `README.md` and `PROMPTS.md` were authored with Gemini based on actual code, commit history, and assessment requirements

---

### Reflection

AI dramatically accelerated scaffolding and debugging without replacing the engineering judgement required for TDD discipline. The most important discipline was keeping **tests and implementation in separate commits** — this preserved the Red → Green history even when AI could generate both in one step. I reviewed every AI-generated suggestion against the kata constraints (JWT protection, admin-only routes, correct HTTP status codes) before committing. The main risk of AI assistance in TDD is skipping the Red phase; I avoided this by intentionally separating test commits from implementation commits and verifying test failures before wiring the implementation. Documenting every prompt in `PROMPTS.md` and adding co-author trailers to commits keeps the workflow fully transparent and interview-ready.

---

### Commit co-authorship

Every commit where AI assistance was used includes one of the following trailers:

```
Co-authored-by: Cursor <cursor@users.noreply.github.com>
Co-authored-by: ChatGPT <AI@users.noreply.github.com>
```

---

## Optional Deployment

| Part     | Suggested host            | URL                                      |
| -------- | ------------------------- | ---------------------------------------- |
| Frontend | Vercel                    | https://car-dealership-wine.vercel.app   |
| Backend  | Render                    | https://car-dealership-dozs.onrender.com |
| Database | MongoDB Atlas (free tier) |                                          |

---

## License

ISC
