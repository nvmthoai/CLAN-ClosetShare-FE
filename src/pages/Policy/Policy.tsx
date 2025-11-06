import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Users, FileText, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Policy() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Chính sách & Điều khoản</h1>
            <p className="text-gray-600 mt-1">
              ClosetShare - Nền tảng chia sẻ tủ đồ cá nhân
            </p>
          </div>
        </div>

        {/* Company Info */}
        <Card className="p-6 mb-8 border-2 border-gray-100 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ClosetShare Platform
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nền tảng chia sẻ tủ đồ cá nhân hàng đầu Việt Nam, kết nối những người yêu thích thời trang 
                và tạo ra cộng đồng chia sẻ quần áo bền vững.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Thời trang bền vững</Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">Chia sẻ cộng đồng</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">An toàn & Tin cậy</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* 1. Giới thiệu */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              1. Giới thiệu về ClosetShare
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>ClosetShare</strong> là nền tảng chia sẻ tủ đồ cá nhân đầu tiên tại Việt Nam, 
                được thiết kế để kết nối những người yêu thích thời trang và tạo ra một cộng đồng 
                chia sẻ quần áo bền vững.
              </p>
              <div className="bg-gradient-to-br from-blue-50/50 to-white border-l-4 border-blue-400 p-4 mb-4 rounded-r-xl">
                <h4 className="font-bold text-gray-900 mb-2">Sứ mệnh của chúng tôi:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Tạo ra cộng đồng chia sẻ thời trang bền vững</li>
                  <li>• Giảm thiểu lãng phí trong ngành thời trang</li>
                  <li>• Kết nối những người có cùng sở thích thời trang</li>
                  <li>• Tạo cơ hội kinh doanh cho các shop thời trang nhỏ</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 2. Dịch vụ */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              2. Dịch vụ của chúng tôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Dành cho Người dùng</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Chia sẻ tủ đồ cá nhân với cộng đồng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Thuê quần áo từ người dùng khác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Mua sắm quần áo second-hand chất lượng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Tham gia cộng đồng thời trang</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Dành cho Shop</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Tạo shop và bán sản phẩm thời trang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Quản lý tồn kho và đơn hàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Tiếp cận khách hàng tiềm năng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>Hỗ trợ marketing và bán hàng</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 3. Điều khoản sử dụng */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              3. Điều khoản sử dụng
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.1. Quyền và nghĩa vụ của người dùng</h3>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Người dùng có quyền:</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Tạo tài khoản và sử dụng các dịch vụ của nền tảng</li>
                    <li>• Chia sẻ, bán, cho thuê quần áo cá nhân</li>
                    <li>• Mua sắm và thuê quần áo từ người dùng khác</li>
                    <li>• Đánh giá và phản hồi về sản phẩm</li>
                    <li>• Báo cáo các hành vi vi phạm</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-red-50/50 to-white p-4 rounded-xl border-2 border-red-200 mt-3">
                  <h4 className="font-bold text-red-900 mb-2">Người dùng không được:</h4>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• Đăng tải nội dung vi phạm pháp luật</li>
                    <li>• Bán hàng giả, hàng nhái</li>
                    <li>• Lừa đảo hoặc gian lận trong giao dịch</li>
                    <li>• Spam hoặc gửi tin nhắn không mong muốn</li>
                    <li>• Xâm phạm quyền riêng tư của người khác</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.2. Chính sách thanh toán</h3>
                <div className="bg-gradient-to-br from-blue-50/50 to-white p-4 rounded-xl border-2 border-blue-200">
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Chúng tôi hỗ trợ thanh toán qua ví điện tử, thẻ ngân hàng</li>
                    <li>• Phí giao dịch: 2.5% cho mỗi giao dịch thành công</li>
                    <li>• Hoàn tiền trong vòng 7 ngày nếu sản phẩm không đúng mô tả</li>
                    <li>• Bảo vệ người mua với chính sách hoàn tiền 100%</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.3. Chính sách vận chuyển</h3>
                <div className="bg-gradient-to-br from-green-50/50 to-white p-4 rounded-xl border-2 border-green-200">
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Hỗ trợ giao hàng toàn quốc</li>
                    <li>• Phí vận chuyển: 25,000đ - 50,000đ tùy khu vực</li>
                    <li>• Thời gian giao hàng: 2-5 ngày làm việc</li>
                    <li>• Đóng gói cẩn thận, đảm bảo chất lượng sản phẩm</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Chính sách bảo mật */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              4. Chính sách bảo mật
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.1. Thu thập thông tin</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, 
                  sử dụng dịch vụ, hoặc liên hệ với chúng tôi. Thông tin bao gồm: tên, email, 
                  số điện thoại, địa chỉ, và thông tin thanh toán.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.2. Sử dụng thông tin</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Thông tin của bạn được sử dụng để cung cấp dịch vụ, xử lý giao dịch, 
                  cải thiện trải nghiệm người dùng, và gửi thông báo quan trọng về tài khoản.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4.3. Bảo vệ thông tin</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân 
                  của bạn khỏi việc truy cập, sử dụng, hoặc tiết lộ trái phép.
                </p>
              </div>
            </div>
          </Card>

          {/* 5. Liên hệ */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-500" />
              5. Thông tin liên hệ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email hỗ trợ</p>
                    <p className="text-gray-600 text-sm">support@closetshare.vn</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Hotline</p>
                    <p className="text-gray-600 text-sm">1900 1234 (miễn phí)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Địa chỉ</p>
                    <p className="text-gray-600 text-sm">
                      123 Nguyễn Huệ, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Giờ làm việc</h3>
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Thứ 2 - Thứ 6: 8:00 - 18:00</li>
                    <li>• Thứ 7: 8:00 - 12:00</li>
                    <li>• Chủ nhật: Nghỉ</li>
                    <li>• Hỗ trợ 24/7 qua chat</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <Card className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl">
            <div className="text-center text-white">
              <h3 className="text-lg font-bold mb-2">
                Cảm ơn bạn đã tin tưởng ClosetShare!
              </h3>
              <p className="text-white/90 text-sm mb-6">
                Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho cộng đồng chia sẻ thời trang.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-200 font-medium"
                >
                  Về trang chủ
                </button>
                <button
                  onClick={() => navigate("/terms")}
                  className="px-5 py-2.5 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-200 font-medium"
                >
                  Điều khoản chi tiết
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
                >
                  Tham gia ngay
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
