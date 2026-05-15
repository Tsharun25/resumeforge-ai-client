import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import DashboardHome from "./pages/dashboard/DashboardHome";
import MyResumes from "./pages/dashboard/MyResumes";
import CreateResume from "./pages/dashboard/CreateResume";
import CoverLetter from "./pages/dashboard/CoverLetter";
import Billing from "./pages/dashboard/Billing";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const token = localStorage.getItem("resumeforge_token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="resumes" element={<MyResumes />} />
        <Route path="create-resume" element={<CreateResume />} />
        <Route path="cover-letter" element={<CoverLetter />} />
        <Route path="billing" element={<Billing />} />
      </Route>
    </Routes>
  );
}