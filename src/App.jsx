import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LegalPage = lazy(() => import("./pages/LegalPage"));

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";

const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const MyResumes = lazy(() => import("./pages/dashboard/MyResumes"));
const CreateResume = lazy(() => import("./pages/dashboard/CreateResume"));
const CoverLetter = lazy(() => import("./pages/dashboard/CoverLetter"));
const FreelancerToolkit = lazy(() =>
  import("./pages/dashboard/FreelancerToolkit")
);
const IdeaRadar = lazy(() => import("./pages/dashboard/IdeaRadar"));
const TrendingAdvice = lazy(() => import("./pages/dashboard/TrendingAdvice"));
const Billing = lazy(() => import("./pages/dashboard/Billing"));
const AdminPayments = lazy(() => import("./pages/dashboard/AdminPayments"));

export default function App() {
  const token = localStorage.getItem("resumeforge_token");

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Home />}
        />

      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route path="/legal/:page" element={<LegalPage />} />

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
        <Route path="freelancer-toolkit" element={<FreelancerToolkit />} />
        <Route path="idea-radar" element={<IdeaRadar />} />
        <Route path="trending-advice" element={<TrendingAdvice />} />
        <Route path="billing" element={<Billing />} />

        <Route
          path="admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />
      </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <Loader2 size={20} className="animate-spin text-indigo-600" />
        <span className="text-sm font-black text-slate-700">Loading...</span>
      </div>
    </div>
  );
}
