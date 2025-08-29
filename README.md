# 🏥 Hospital Management System

A full-stack, role-based hospital management web application built for managing patients, appointments, doctors, services, and payments with seamless admin control and user experience.

🔗 [**Live Demo**](https://hospital-management-bmmd.onrender.com) 

---

## ✨ Features

### 👥 User Roles
- **Patient**: Book appointments, manage profile, browse services & make payments.
- **Doctor**: View appointments, update status (Planned).
- **Admin**: Manage users, doctors, services, and appointments via dashboard.

### 🩺 Appointments
- Real-time doctor listing with **age**, **gender**, **specialization**, and **status**.
- Book appointments with **date**, **slot**, and **reason** using a modal form.
- Validations with real-time feedback using **Zod + React Hook Form**.

### 💳 Services & Payments
- Patients can browse services, add them to a cart, and pay using **Razorpay (test mode)**.
- Post-payment confirmation and backend sync.

### 🔐 Authentication
- **JWT-based secure login** for all roles.
- **Role-Based Access Control (RBAC)** using middleware for protected routes.

### 🛠️ Admin Panel
- View and manage all **users**, **appointments**, and **services**.
- Create and edit doctors via modal dialogs.

### 🌐 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Shadcn UI, React Hook Form, Zod
- **Backend**: Node.js, Express.js, MongoDB, JWT, Razorpay API

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js ≥ 18
- MongoDB (local or cloud)
- Razorpay test account

---

### 🧱 Installation

#### 1. Clone the Repositories

```bash
git clone RushilReddy909/Hospital-Management
``` 

Install backend dependencies
```bash
npm install
```

Make an env in root folder like this
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Setup frontend
```bash
cd client
npm install
```

Run both using
```bash
npm run dev
```

