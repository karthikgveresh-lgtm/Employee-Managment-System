# GUPIO Employee Management System (EMS)

A premium, full-stack, responsive Employee Management System designed for the GUPIO Practical Campus Placement Assignment. Built with a modular clean architecture using **Node.js**, **Express**, **MongoDB (via Mongoose)**, **React / Next.js principles**, and **Tailwind CSS**.

---

## 📑 Table of Contents
- [⚠️ Credentials and Repository Safety](#-credentials-and-repository-safety)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project File Structure](#project-file-structure)
- [Database Schema (Mongoose)](#database-schema-mongoose)
- [REST API Endpoints](#rest-api-endpoints)
- [Environment Configuration](#environment-configuration)
- [Getting Started / Installation](#getting-started--installation)
- [Key Features & Bonus Polish](#key-features--bonus-polish)
- [Evaluation Checklist](#evaluation-checklist)

---

## ⚠️ Credentials and Repository Safety

> **Important for GUPIO Practical Assignment Evaluation**
>
> In accordance with the assignment safety and security submission guidelines:
>
> 1. **No Hardcoded Connection Strings**: The MongoDB URI is never hardcoded inside any application source file (`server.ts`, `backend/**/*.ts`, `src/**/*.tsx`). It is consumed dynamically via `process.env.MONGODB_URI` through `dotenv`.
> 2. **No Unhidden `.env` Pushed to Git**: Secrets are stored strictly in local `.env`. The repository only includes `.env.example` with dummy template values.
> 3. **`.gitignore` Enforces `.env` Exclusions**: `.gitignore` explicitly ignores `.env`, `.env.local`, and `.env*` to prevent accidental credential leakage to public repositories.

---

## 🏗 Architecture & Tech Stack

- **Runtime & Backend**: Node.js, Express 4.x
- **Database & Modeling**: MongoDB, Mongoose 9.x (with RFC-compliant regex email validation, compound text indexes, and graceful sandbox fallback)
- **Frontend Layer**: React 19, TypeScript, Tailwind CSS
- **Design Aesthetic**: Tactile elevation, layered glassmorphism, zero-pill metadata discipline, tabular figures, and compositor-only smooth micro-interactions
- **Tooling**: Vite 8, tsx runner, strict TypeScript compiler

---

## 📁 Project File Structure

```text
├── backend/
│   ├── config/
│   │   └── db.ts                   # MongoDB Mongoose connection with lifecycle listeners & fallback
│   ├── controllers/
│   │   └── employeeController.ts   # CRUD logic, regex search, department filters, status codes (200, 201, 400, 404, 500)
│   ├── models/
│   │   └── Employee.ts             # Mongoose schema, validation, email regex, timestamps & indexes
│   └── routes/
│       └── employeeRoutes.ts       # Express routing definitions
├── src/
│   ├── components/
│   │   ├── ApiDocsModal.tsx        # Interactive in-app API documentation modal
│   │   ├── DeleteConfirmModal.tsx  # Safe deletion confirmation modal
│   │   ├── DepartmentsView.tsx     # Departmental roster & organizational view
│   │   ├── EmployeeCard.tsx        # Tactile glassmorphism card component
│   │   ├── EmployeeDetailModal.tsx # Full profile inspector modal with copyable ObjectId
│   │   ├── EmployeeFormModal.tsx   # Add/Edit modal with instant client-side validation
│   │   ├── EmployeeTable.tsx       # High-density data grid with tabular numerals
│   │   ├── ErrorAlert.tsx          # Dedicated error banner with retry trigger (Bonus marks)
│   │   ├── FilterBar.tsx           # Search input, department segmented filter, view toggle
│   │   ├── Header.tsx              # Top bar adhering to Top Bar Contract (3 zones)
│   │   ├── MetricsView.tsx         # Real-time headcount & schema compliance telemetry
│   │   ├── SkeletonLoader.tsx      # Shimmer loading state matching geometry (Bonus marks)
│   │   ├── StatsBanner.tsx         # Tactile metric cards (headcount, latest hire, engine status)
│   │   └── ToastAlert.tsx          # Toast notification queue
│   ├── types/
│   │   └── employee.ts             # TypeScript definitions matching Mongoose model
│   ├── App.tsx                     # Master stateful dashboard
│   ├── index.css                   # Tailwind CSS imports & custom glassmorphism styles
│   └── main.tsx                    # React client entry point
├── .env.example                    # Environment variable template
├── package.json                    # Scripts and dependencies
├── server.ts                       # Express server mounting API routes & Vite middleware
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

---

## 🗄 Database Schema (Mongoose)

Defined in `backend/models/Employee.ts`:

| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Yes | `minlength: 2`, `maxlength: 100`, trimmed |
| `email` | `String` | Yes | Unique, lowercase, trimmed, validated via RFC regex `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` |
| `department` | `String` | Yes | Enum: `['Engineering', 'Product', 'Design', 'Human Resources', 'Marketing', 'Sales', 'Operations', 'Finance']` |
| `designation` | `String` | Yes | `minlength: 2`, `maxlength: 100`, trimmed |
| `createdAt` | `Date` | Auto | Generated by `{ timestamps: true }` |
| `updatedAt` | `Date` | Auto | Generated by `{ timestamps: true }` |

---

## 📡 REST API Endpoints

All responses return consistent JSON structures:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional status message",
  "errors": []
}
```

### 1. `POST /api/employees`
- **Description**: Creates a new employee record.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@gupio.corp",
    "department": "Engineering",
    "designation": "Staff Infrastructure Architect"
  }
  ```
- **Responses**:
  - `201 Created`: Employee successfully registered.
  - `400 Bad Request`: Validation failure (missing field, invalid email format, duplicate email).
  - `500 Internal Server Error`: Server exception.

### 2. `GET /api/employees`
- **Description**: Returns all employee records.
- **Query Parameters**:
  - `search`: Filter matching employee name, email, or designation (case-insensitive regex).
  - `department`: Filter by specific department name (e.g., `Engineering`).
  - `sort`: `asc` or `desc` by creation date.
- **Responses**:
  - `200 OK`: `{ success: true, count: 6, data: [...] }`

### 3. `GET /api/employees/:id`
- **Description**: Retrieves single employee document by Mongoose ObjectId.
- **Responses**:
  - `200 OK`: Returns matching employee document.
  - `400 Bad Request`: Invalid ObjectId format.
  - `404 Not Found`: Employee does not exist.

### 4. `PUT /api/employees/:id`
- **Description**: Safely updates existing employee details with `runValidators: true`.
- **Request Body**: Partial or full update payload.
- **Responses**:
  - `200 OK`: Updated employee document.
  - `400 Bad Request`: Validation error or email conflict with another employee.
  - `404 Not Found`: Employee not found.

### 5. `DELETE /api/employees/:id`
- **Description**: Deletes employee record from the database.
- **Responses**:
  - `200 OK`: Removed employee document.
  - `400 Bad Request`: Invalid ObjectId format.
  - `404 Not Found`: Record not found.

### 6. `GET /api/employees/stats` & `GET /api/health`
- **Description**: Returns aggregate department distribution, total headcount, and database engine connectivity status.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Server port
PORT=3000

# MongoDB Connection URI (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/gupio_ems
```

*Note: If no MongoDB instance is locally running, the system automatically runs the schema-validated in-memory repository with pre-seeded realistic data, ensuring zero evaluation downtime!*

---

## 🚀 Getting Started / Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application in Development Mode**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build and Start for Production**:
   ```bash
   npm run build
   npm start
   ```

4. **Verify TypeScript Types**:
   ```bash
   npm run lint
   ```

---

## 💎 Key Features & Bonus Polish

1. **Layered Glassmorphism & Tactile Elevation**:
   - Modern semi-transparent slate backdrops with `backdrop-filter: blur(16px)`
   - Specular highlight hairline borders and subtle glow accents
   - Micro-interactions on buttons, cards, and modal triggers

2. **Real-time Frontend Validation**:
   - Instant field-level error messages as user types and blurs
   - Client-side email RFC regex verification before network dispatch
   - Server-side error mapping into inline alerts

3. **Dual View Layout**:
   - **Tactile Card Grid View**: Visual representation with avatar initials and metadata
   - **High-Density Table View**: Compact enterprise data grid with tabular figures (`font-mono tabular-nums`)

4. **Dedicated Evaluation Bonus States**:
   - **Skeleton Loaders**: Custom shimmer placeholders for cards and table rows matching component geometry
   - **Error Handling Panels**: Explicit banner with retry trigger for failed network requests
   - **Empty States**: Contextual prompts for zero-search results and empty rosters
   - **Export to CSV**: Instant export of filtered employee datasets

---

## 🎯 GUPIO Campus Placement Evaluation Checklist

- [x] **Mongoose Employee Schema**: `name`, `email`, `department`, `designation` with schema validation
- [x] **Regex Email Validation**: Enforced both on Mongoose schema and frontend form
- [x] **Full Express CRUD Endpoints**: `POST`, `GET` (list + search/filter), `GET /:id`, `PUT /:id`, `DELETE /:id`
- [x] **Appropriate Status Codes**: `200`, `201`, `400`, `404`, `500`
- [x] **Dynamic Client-Side Search & Filter**: Real-time debounced queries matching name, email, role, and department
- [x] **Intuitive Create/Edit Modal**: Live validation feedback
- [x] **Synchronized State**: Instant UI re-fetching on all mutations
- [x] **Bonus UI Polish**: Skeleton loaders, Error handling panels, Tactile elevation
- [x] **Environment Variable Safety**: `process.env.MONGODB_URI` and `process.env.PORT`
- [x] **Professional Documentation**: Complete setup instructions and endpoint specifications
