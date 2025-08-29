import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import Profile from "./pages/Account";
import SidebarLayout from "./components/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Doctors from "./pages/Doctors";
import Support from "./pages/Support";
import Services from "./pages/Services";
import Transactions from "./pages/Transactions";

// Admin nested pages
import Analytics from "./pages/admin/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import Appointments from "./pages/admin/Appointments";
import AdminTransactions from "./pages/admin/Transactions";
import AdminHome from "./pages/admin/AdminHome";

//Doctor nested pages
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorAppointments from "./pages/doctor/Appointments";
import Prediction from "./pages/Prediction";

const App = () => {
  return (
    <Routes>
      {/* Protected user routes */}
      <Route
        element={
          <ProtectedRoute roles={["admin", "patient", "doctor", "user"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/support" element={<Support />} />
        <Route path="/services" element={<Services />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/predictor" element={<Prediction />} />
      </Route>

      {/* Admin-only routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<AdminHome />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="transactions" element={<AdminTransactions />} />
      </Route>

      {/* Doctor-only routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute roles={["doctor", "admin"]}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<DoctorHome />} />
        <Route path="appointments" element={<DoctorAppointments />} />
      </Route>

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
    </Routes>
  );
};

export default App;
