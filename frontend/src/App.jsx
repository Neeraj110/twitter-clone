import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="bg-black">
      <BrowserRouter>
        <ToastContainer
          className="pl-[4rem] pr-[2rem] mt-[1rem] text-[.8rem] md:p-0 "
          autoClose={1000}
        />
        <Routes>
          <Route
            path="/"
            element={userInfo ? <Navigate to="/dashboard" /> : <HomePage />}
          />
          <Route
            path="/login"
            element={userInfo ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={userInfo ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />
          <Route
            path="/dashboard/*"
            element={userInfo ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
