import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import ErrorPage from "./pages/ErrorPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import CalendarMainPage from "./pages/camp/camplist";
import DonorListPage from "./pages/donors/DonorListPage";
import AddRequesterPage from "./pages/requestor/AddRequesterPage";
import AddAdmin from "./pages/admin/addadmin";
import LoginForm from "./pages/auth/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { adminToken } = useAuth();
  
  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteScrollToTop />
        <Routes>
          
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<LoginForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePageOne />
            </ProtectedRoute>
          }
        />

        <Route
          path="/camp"
          element={
            <ProtectedRoute>
              <CalendarMainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor-list"
          element={
            <ProtectedRoute>
              <DonorListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-requester"
          element={
            <ProtectedRoute>
              <AddRequesterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-admin"
          element={
            <ProtectedRoute>
              <AddAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
