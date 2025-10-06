import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "react-toastify";

// This page is the returnUrl that PayOS (or backend redirect) sends user back to.
// It parses query params, optionally you can call a payment status API here.
export default function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderCode = params.get("orderCode") || params.get("order_code");
    const status = params.get("status");
    // const signature = params.get("signature"); // if you want to inspect

    if (!orderCode) {
      toast.error("Thiếu mã đơn hàng");
      navigate("/payment/failure", { replace: true });
      return;
    }

    // If we had a payment status endpoint we could fetch it here then branch.
    // For now we consider status === 'PAID' || 'SUCCESS' as success.
    if (status && ["PAID", "SUCCESS", "paid", "success"].includes(status)) {
      navigate(`/payment/success?orderCode=${orderCode}`, { replace: true });
    } else {
      navigate(
        `/payment/failure?orderCode=${orderCode}&status=${status || "unknown"}`,
        {
          replace: true,
        }
      );
    }
  }, [location.search, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm text-gray-600">
          Đang xử lý kết quả thanh toán...
        </p>
      </div>
    </Layout>
  );
}
