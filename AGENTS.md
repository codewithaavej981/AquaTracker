# AquaTracker - Agent Guidelines & Scope Restrictions

## Project Overview
- **Project Name:** AquaTracker (Water Consumption Monitoring and Complaint Reporting System)
- **Context:** MSBTE Micro-project
- **Timeline:** 2 Days
- **Core Philosophy:** SMALL, SIMPLE, MODERN, FULLY FUNCTIONAL. This is an educational diploma micro-project, NOT an enterprise or final-year thesis. Keep engineering pragmatic and minimal.

---

## Technical Stack & Architecture

### Frontend
- **Framework:** React.js (via Vite)
- **UI Library:** Ant Design (`antd`)
- **Routing:** React Router (`react-router-dom`)
- **HTTP Client:** Axios
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js
- **Server Framework:** Express.js
- **Database Driver / ODM:** Mongoose
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing:** `bcryptjs`

### Database
- **Database:** MongoDB Atlas

---

## Role & Authentication Rules

1. **Strict Two-Role Model:**
   - `user`: Standard citizen / household user.
   - `admin`: System administrator.
2. **Registration Enforcement:**
   - Public registration MUST strictly create accounts with the `user` role.
   - Under no circumstances should there be a role selector (`admin` vs `user`) on the registration UI.
   - Admin accounts are strictly provisioned via a dedicated backend seed or setup script.
3. **Security Standards:**
   - Passwords must be hashed using `bcryptjs` prior to storage.
   - Authentication must use standard JWT bearer tokens.
   - Express middleware must verify JWT for protected routes (`authMiddleware`).
   - Express middleware must verify admin role for administrative routes (`adminMiddleware`).

---

## Data Models & Collections

### 1. `users`
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `role` (String, enum: `['user', 'admin']`, default: `'user'`)
- `createdAt` (Date, timestamp)

### 2. `water_consumption`
- `userId` (ObjectId, ref: `'User'`, required)
- `date` (Date / String YYYY-MM-DD, required)
- `morning` (Number, >= 0, in litres)
- `afternoon` (Number, >= 0, in litres)
- `evening` (Number, >= 0, in litres)
- `total` (Number, calculated by backend as `morning + afternoon + evening`)
- `createdAt` (Date, timestamp)

### 3. `complaints`
- `userId` (ObjectId, ref: `'User'`, required)
- `type` (String, enum: `['Water Leakage', 'No Water Supply', 'Low Water Pressure', 'Dirty Water', 'Pipeline Damage', 'Other']`, required)
- `location` (String, required)
- `description` (String, required)
- `priority` (String, enum: `['Low', 'Medium', 'High']`, default: `'Medium'`)
- `status` (String, enum: `['Pending', 'In Progress', 'Resolved']`, default: `'Pending'`)
- `createdAt` (Date, timestamp)
- `updatedAt` (Date, timestamp)

---

## UI / Design Guidelines

- **Style:** Classic + modern professional water-management theme.
- **Palette & Elements:**
  - Light background (`#f8fafc` / `#f0f5ff`)
  - Aqua / ocean blue primary colors (`#0284c7`, `#0ea5e9`, Ant Design primary)
  - Dark navy text for readability
  - Clean white cards with subtle box-shadows and rounded corners
  - Standard Ant Design components and simple Recharts visualizations
  - Clean, fully responsive layout
- **Anti-Patterns (DO NOT USE):**
  - No excessive animations or spinning decorations
  - No harsh rainbow gradients
  - No unnecessary glassmorphism or blur effects
  - No cluttered dashboards or deeply nested modals

---

## Strict Scope Limitations (DO NOT ADD)

The following items are **strictly prohibited** in AquaTracker to guarantee timely delivery and preserve micro-project scope:

- ❌ **NO AI / Machine Learning**
- ❌ **NO IoT or physical sensor integrations**
- ❌ **NO Google Maps or GIS tracking**
- ❌ **NO Payment gateways or billing systems**
- ❌ **NO SMS or OTP verification**
- ❌ **NO Email verification or SMTP mailers**
- ❌ **NO Google OAuth or social logins**
- ❌ **NO Web push or real-time web socket notifications**
- ❌ **NO Mobile app (Flutter/React Native)**
- ❌ **NO Water consumption predictive models**
- ❌ **NO Advanced data science / analytics**
- ❌ **NO Unnecessary dependencies or third-party cloud services**

---

## Phased Development Roadmap

- **Phase 1 (40%): Foundation & Core Authentication**
  - Backend project structure & Express server setup
  - MongoDB Atlas connection
  - User model & JWT authentication endpoints (Register, Login, Me)
  - Frontend Vite + React setup with Ant Design
  - Auth context, Login/Register pages, and role-based route guards

- **Phase 2 (30%): Water Consumption & Complaints Management**
  - Water consumption logging, backend total computation, and history endpoints
  - User consumption dashboard with Recharts visualization
  - Complaint submission and personal complaint tracking list

- **Phase 3 (30%): Admin Dashboard, Polish & Testing**
  - Admin seed script
  - Admin dashboard displaying platform statistics, user lists, and all complaints
  - Admin complaint status updates (`Pending` -> `In Progress` -> `Resolved`)
  - End-to-end testing, UI polish, and final documentation
