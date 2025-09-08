import { ToastContainer } from "react-toastify";
import ScrollToTop from "../components/ui/autoScroll";
import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Login from "@/pages/LoginPage/Login";

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
