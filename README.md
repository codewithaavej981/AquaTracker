# AquaTracker
### Water Consumption Monitoring and Complaint Reporting System

An MSBTE Diploma Micro-Project built with the MERN stack (React, Node.js, Express, MongoDB Atlas) to monitor household water usage and streamline community water issue reporting.

---

## 🎯 Project Objective

The primary objective of **AquaTracker** is to provide an accessible, user-friendly digital platform for citizens and municipal administrators to:
1. Record and monitor daily water consumption across morning, afternoon, and evening cycles.
2. Report civic water grievances (leaks, pipeline breaks, dirty water, shortages) with clarity and priority.
3. Allow administrators to monitor user submissions, review complaints, and update grievance resolution statuses in real time.

---

## ⚠️ Problem Statement

In many municipal and residential localities, water usage is rarely tracked at a household level, leading to unnoticed wastage and inefficient consumption habits. Furthermore, reporting water supply disruptions, pipeline leaks, or quality contamination frequently relies on manual, unorganized channels (verbal complaints, physical registers, or phone calls), resulting in delayed responses and a lack of accountability.

**AquaTracker** addresses these challenges by offering a lightweight, centralized web portal that simplifies individual consumption tracking and provides a structured mechanism for lodging and tracking water-related complaints.

---

## 👥 User & Admin Roles

AquaTracker enforces a strict two-role access control model:

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Citizen / User** | • Register personal account<br>• Login & secure session management<br>• View personal consumption dashboard & analytics chart<br>• Log daily water consumption (Morning, Afternoon, Evening litres)<br>• View consumption history logs<br>• Submit water-related complaints with priority and details<br>• Track complaint status (`Pending`, `In Progress`, `Resolved`)<br>• View account profile |
| **Administrator** | • Dedicated admin login<br>• View administrative analytics dashboard<br>• View registered user directory<br>• View all submitted community complaints<br>• Update complaint progress & resolution status<br>• Secure logout |

> **Note on Registration:** Public registration is strictly restricted to citizen `user` accounts. Admin accounts are initialized via a secure backend seeding process to prevent unauthorized role escalation.

---

## 🚀 Main Features

### 1. Water Consumption Monitoring
- **Periodic Entry:** Users log water intake separated by Morning, Afternoon, and Evening (in litres).
- **Backend Calculation:** Total consumption is strictly computed server-side (`morning + afternoon + evening`) to ensure data consistency.
- **Consumption Visualization:** Visual trend representation using Recharts for daily and historical monitoring.

### 2. Civic Complaint Redressal
- **Standardized Categories:**
  - Water Leakage
  - No Water Supply
  - Low Water Pressure
  - Dirty Water
  - Pipeline Damage
  - Other
- **Priority Indicators:** Low, Medium, High.
- **Lifecycle Tracking:** Direct status visibility from `Pending` to `In Progress` and `Resolved`.

### 3. Clean & Modern User Experience
- Light, aqua/ocean-themed professional styling using Ant Design.
- Clean card-based dashboard with responsive layout.
- Fast, secure client-side routing and protected routes.

---

## 💻 Technology Stack

### Frontend
- **Framework:** React.js (via Vite)
- **UI Component Library:** Ant Design (`antd`)
- **Routing:** React Router (`react-router-dom`)
- **HTTP Client:** Axios
- **Data Visualization:** Recharts

### Backend
- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Object Data Modeling (ODM):** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** `bcryptjs`

### Database
- **Database:** MongoDB Atlas (Cloud Database)

---

## 📅 Planned 3-Phase Development Roadmap

| Phase | Milestone | Scope / Deliverables |
| :---: | :---: | :--- |
| **Phase 1** *(40%)* | **Foundation & Authentication** | • Setup project structure (`frontend` and `backend`)<br>• Configure Express server, MongoDB Atlas connection, and error handling<br>• Implement user registration, login, JWT token issuance, and password hashing<br>• Setup Vite React application with Ant Design layout and protected routing |
| **Phase 2** *(30%)* | **Consumption & Complaints** | • Develop water consumption logging backend API (automatic total computation)<br>• Build user water consumption dashboard and Recharts visual graph<br>• Implement complaint submission API and citizen complaint tracking history table |
| **Phase 3** *(30%)* | **Admin Dashboard & Final Polish** | • Create admin seeding script for administrative access<br>• Build admin dashboard with user overview and global complaint management<br>• Implement status update workflows (`Pending` → `In Progress` → `Resolved`)<br>• End-to-end verification, responsive UI polish, and micro-project documentation |

---

## 📁 Project Structure

```text
AquaTracker/
├── frontend/          # React.js client application (Vite + Ant Design)
├── backend/           # Node.js + Express REST API server
├── .gitignore         # Standard git ignore definitions
├── AGENTS.md          # Project boundaries, rules, and scope guidelines
└── README.md          # Project documentation and roadmap
```
