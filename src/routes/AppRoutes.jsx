import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import TeacherManagement from "../pages/dashboard/TeacherManagement";
import SubjectManagement from "../pages/dashboard/SubjectManagement";
import RoomLabManagement from "../pages/dashboard/RoomLabManagement";
import SetupWizard from "../pages/setup/SetupWizard";
import TimetablePreview from "../pages/timetable/TimetablePreview";
import Settings from "../pages/settings/Settings";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-medium text-slate-200">
          Loading SchedNova...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute user={user}>
            <TeacherManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute user={user}>
            <SubjectManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute user={user}>
            <RoomLabManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup"
        element={
          <ProtectedRoute user={user}>
            <SetupWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <ProtectedRoute user={user}>
            <TimetablePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute user={user}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
