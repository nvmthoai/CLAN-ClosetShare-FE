import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

export default function PaymentSuccess() {
  const params = new URLSearchParams(useLocation().search);
  const orderCode = params.get("orderCode");
  return (
    <Layout>
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
        <p className="text-gray-600 text-sm">
          Cảm ơn bạn. Đơn hàng của bạn đang được xác nhận.{" "}
          {orderCode && (
            <span className="block mt-2">
              Mã đơn: <strong>{orderCode}</strong>
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Link
            to="/activity"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
          >
            Xem hoạt động
          </Link>
          <Link
            to="/shop"
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </Layout>
  );
}
