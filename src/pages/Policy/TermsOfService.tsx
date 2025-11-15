import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Điều khoản dịch vụ</h1>
            <p className="text-gray-600 mt-1">
              Điều khoản sử dụng nền tảng ClosetShare
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <Card className="p-4 mb-8 bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-200 shadow-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900 font-bold">Cập nhật lần cuối:</span>
            <span className="text-gray-700 font-medium">15/01/2024</span>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* 1. Chấp nhận điều khoản */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Chấp nhận điều khoản
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Bằng việc truy cập và sử dụng nền tảng ClosetShare, bạn đồng ý tuân thủ 
                và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu trong tài liệu này.
              </p>
              <div className="bg-gradient-to-br from-yellow-50/50 to-white border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Lưu ý quan trọng</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Định nghĩa */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Định nghĩa
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">"Nền tảng"</h4>
                  <p className="text-gray-700 text-sm">
                    Website, ứng dụng di động và các dịch vụ liên quan của ClosetShare
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">"Người dùng"</h4>
                  <p className="text-gray-700 text-sm">
                    Bất kỳ cá nhân hoặc tổ chức nào sử dụng nền tảng
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">"Sản phẩm"</h4>
                  <p className="text-gray-700 text-sm">
                    Quần áo, phụ kiện thời trang được chia sẻ trên nền tảng
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">"Giao dịch"</h4>
                  <p className="text-gray-700 text-sm">
                    Việc mua bán, cho thuê sản phẩm giữa các người dùng
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Quyền và nghĩa vụ */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Quyền và nghĩa vụ của người dùng
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Quyền của người dùng
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Tạo và quản lý tài khoản cá nhân</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Đăng tải và quản lý sản phẩm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Mua sắm và thuê sản phẩm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Đánh giá và phản hồi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Báo cáo vi phạm</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Nghĩa vụ của người dùng
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Cung cấp thông tin chính xác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Tuân thủ pháp luật Việt Nam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Không đăng nội dung vi phạm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Bảo mật tài khoản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Thanh toán đúng hạn</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 4. Chính sách sản phẩm */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Chính sách sản phẩm
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50/50 to-white border-l-4 border-green-400 p-4 rounded-r-xl">
                <h4 className="font-bold text-gray-900 mb-2">Sản phẩm được phép:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Quần áo thời trang chính hãng</li>
                  <li>• Phụ kiện thời trang (túi xách, giày dép, trang sức)</li>
                  <li>• Sản phẩm second-hand còn sử dụng tốt</li>
                  <li>• Sản phẩm handmade, vintage</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-50/50 to-white border-l-4 border-red-400 p-4 rounded-r-xl">
                <h4 className="font-bold text-red-900 mb-2">Sản phẩm bị cấm:</h4>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• Hàng giả, hàng nhái</li>
                  <li>• Sản phẩm vi phạm bản quyền</li>
                  <li>• Quần áo có nội dung phản cảm</li>
                  <li>• Sản phẩm nguy hiểm, độc hại</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 5. Chính sách giao dịch */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Chính sách giao dịch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50/50 to-white p-4 rounded-xl border-2 border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Thanh toán</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Hỗ trợ ví điện tử</li>
                  <li>• Thẻ ngân hàng</li>
                  <li>• COD (giao hàng nhận tiền)</li>
                  <li>• Phí giao dịch: 2.5%</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50/50 to-white p-4 rounded-xl border-2 border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Vận chuyển</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Giao hàng toàn quốc</li>
                  <li>• Phí: 25k - 50k</li>
                  <li>• Thời gian: 2-5 ngày</li>
                  <li>• Đóng gói cẩn thận</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50/50 to-white p-4 rounded-xl border-2 border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Hoàn trả</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Hoàn tiền 100%</li>
                  <li>• Trong 7 ngày</li>
                  <li>• Sản phẩm không đúng mô tả</li>
                  <li>• Bảo vệ người mua</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 6. Xử lý vi phạm */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Xử lý vi phạm
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-yellow-50/50 to-white border-2 border-yellow-200 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Cảnh báo</h4>
                <p className="text-gray-700 text-sm">
                  Lần vi phạm đầu tiên: Cảnh báo và yêu cầu chỉnh sửa
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-200 p-4 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Tạm khóa</h4>
                <p className="text-gray-700 text-sm">
                  Vi phạm nhiều lần: Tạm khóa tài khoản 7-30 ngày
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50/50 to-white border-2 border-red-200 p-4 rounded-xl">
                <h4 className="font-bold text-red-900 mb-2">Khóa vĩnh viễn</h4>
                <p className="text-red-800 text-sm">
                  Vi phạm nghiêm trọng: Khóa tài khoản vĩnh viễn
                </p>
              </div>
            </div>
          </Card>

          {/* 7. Thay đổi điều khoản */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Thay đổi điều khoản
            </h2>
            <div className="bg-gradient-to-br from-blue-50/50 to-white border-l-4 border-blue-400 p-4 rounded-r-xl">
              <p className="text-gray-700 text-sm leading-relaxed">
                ClosetShare có quyền cập nhật các điều khoản này bất kỳ lúc nào. 
                Chúng tôi sẽ thông báo trước ít nhất 7 ngày về những thay đổi quan trọng. 
                Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là chấp nhận 
                các điều khoản mới.
              </p>
            </div>
          </Card>

          {/* Footer */}
          <Card className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl">
            <div className="text-center text-white">
              <h3 className="text-lg font-bold mb-2">
                Có câu hỏi về điều khoản?
              </h3>
              <p className="text-white/90 text-sm mb-6">
                Liên hệ với chúng tôi để được hỗ trợ
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => navigate("/policy")}
                  className="px-5 py-2.5 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-200 font-medium"
                >
                  Chính sách chung
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
