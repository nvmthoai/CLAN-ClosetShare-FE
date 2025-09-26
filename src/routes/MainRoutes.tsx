import { ToastContainer } from "react-toastify";
import ScrollToTop from "../components/ui/autoScroll";
import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Auth/Login/Login";
import Register from "@/pages/Auth/Register/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword/ResetPassword";
import Products from "@/pages/Products/Products";
import Profile from "@/pages/Profile/Profile";
import EditProfile from "@/pages/Profile/EditProfile";
import Home from "@/pages/Home/Home";
import Feed from "@/pages/Feed/Feed";
import Search from "@/pages/Search/Search";
import Activity from "@/pages/Activity/Activity";

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
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}
