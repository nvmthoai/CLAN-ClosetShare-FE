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
import ProductDetail from "@/pages/Products/ProductDetail";
import Profile from "@/pages/Profile/Profile";
import EditProfile from "@/pages/Profile/EditProfile";
import Layout from "@/components/layout/Layout";

import Feed from "@/pages/Feed/Feed";
import Activity from "@/pages/Activity/Activity";
import Subscriptions from "@/pages/Subscription/Subscriptions";
import PaymentCallback from "@/pages/Payment/PaymentCallback";
import PaymentSuccess from "@/pages/Payment/PaymentSuccess";
import PaymentFailure from "@/pages/Payment/PaymentFailure";
import ViewShop from "@/pages/Shop/ViewShop";
import ShopManagement from "@/pages/Shop/ShopManagement";
import CreateShop from "@/pages/Shop/CreateShop";
import EditShop from "@/pages/Shop/EditShop";
import ProductDemo from "@/pages/Shop/ProductDemo";
import Policy from "@/pages/Policy/Policy";
import TermsOfService from "@/pages/Policy/TermsOfService";

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

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Feed />
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
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
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
        {/* <Route
          path="/search"/
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/callback"
          element={
            <ProtectedRoute>
              <PaymentCallback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/failure"
          element={
            <ProtectedRoute>
              <PaymentFailure />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-shop/:id"
          element={
            <ProtectedRoute>
              <ViewShop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/shops"
          element={
            <ProtectedRoute>
              <Layout>
                <ShopManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateShop />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditShop />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/demo"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductDemo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Create Post</h1>
                  <p className="text-gray-600">
                    Upload your fashion content here...
                  </p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </>
  );
}
