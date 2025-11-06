import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { XCircle } from "lucide-react";

export default function PaymentFailure() {
  const params = new URLSearchParams(useLocation().search);
  const orderCode = params.get("orderCode");
  const status = params.get("status");
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-8 text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center border-4 border-red-200 shadow-lg">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Thanh toán thất bại</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rất tiếc, thanh toán chưa hoàn tất. Vui lòng thử lại hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
              </p>
            </div>

            {/* Order Info */}
            {(orderCode || status) && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 p-4 space-y-2">
                {orderCode && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                    <span className="text-sm font-bold text-gray-900">{orderCode}</span>
                  </div>
                )}
                {status && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-gray-500">Trạng thái:</span>
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">{status}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/shop"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
              >
                Thử lại
              </Link>
              <Link
                to="/activity"
                className="px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
              >
                Xem hoạt động
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
