import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect } from "react";
import { getAllNotifications } from "./slices/notification/notificationApi";
import {
  setNotifications,
  setUnreadCount,
} from "./slices/notification/notificationSlice";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/home/HomePage"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const RegisterPage = lazy(() => import("./pages/register/RegisterPage"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ResetPassword = lazy(() =>
  import("./pages/reset-password/ResetPassword")
);

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) return;

    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const { data } = await getAllNotifications();
        if (!mounted) return;

        const notifications = data || [];
        dispatch(setNotifications(notifications));
        const unreadCount = notifications.filter((n) => n.unread).length;
        dispatch(setUnreadCount(unreadCount));
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    return () => {
      mounted = false;
    };
  }, [dispatch, userInfo]);

  const ProtectedRoute = ({ children, isAuthenticated }) =>
    isAuthenticated ? children : <Navigate to="/login" />;

  const PublicRoute = ({ children, isAuthenticated }) =>
    isAuthenticated ? <Navigate to="/dashboard" /> : children;

  return (
    <div className="bg-black min-h-screen">
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          className="pl-16 pr-8 mt-4 text-sm md:p-0"
          toastClassName="rounded-lg"
        />
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute isAuthenticated={!!userInfo}>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={!!userInfo}>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute isAuthenticated={!!userInfo}>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute isAuthenticated={!!userInfo}>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute isAuthenticated={!!userInfo}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
