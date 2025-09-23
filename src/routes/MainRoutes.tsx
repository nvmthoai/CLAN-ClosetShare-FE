import { ToastContainer } from "react-toastify";
import ScrollToTop from "../components/ui/autoScroll";
import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Auth/Login/Login";
import Register from "@/pages/Auth/Register/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword/ResetPassword";

export default function MainRoutes() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}
