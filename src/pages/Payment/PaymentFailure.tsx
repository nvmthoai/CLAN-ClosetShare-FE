import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

export default function PaymentFailure() {
  const params = new URLSearchParams(useLocation().search);
  const orderCode = params.get("orderCode");
  const status = params.get("status");
  return (
    <Layout>
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9 9 15" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Thanh toán thất bại</h1>
        <p className="text-gray-600 text-sm">
          Rất tiếc, thanh toán chưa hoàn tất.
          {orderCode && (
            <span className="block mt-2">
              Mã đơn: <strong>{orderCode}</strong>
            </span>
          )}
          {status && (
            <span className="block mt-1 text-xs text-gray-500">
              Trạng thái: {status}
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Link
            to="/shop"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
          >
            Thử lại
          </Link>
          <Link
            to="/activity"
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Xem hoạt động
          </Link>
        </div>
      </div>
    </Layout>
  );
}
