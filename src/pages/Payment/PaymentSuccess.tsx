import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const params = new URLSearchParams(useLocation().search);
  const orderCode = params.get("orderCode");
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-8 text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border-4 border-green-200 shadow-lg">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Thanh toán thành công!</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cảm ơn bạn. Đơn hàng của bạn đang được xác nhận và sẽ được xử lý trong thời gian sớm nhất.
              </p>
            </div>

            {/* Order Info */}
            {orderCode && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 p-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                  <span className="text-sm font-bold text-gray-900">{orderCode}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/activity"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
              >
                Xem hoạt động
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
