import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/apis/shop.api";
import { getUserId } from "@/lib/user";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Store,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  Camera,
  BarChart3,
  Users,
  Package,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import type { Shop } from "@/models/Shop";

export default function ShopManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data for single shop - phù hợp với API response
  const mockShop: Shop = {
    id: "e928f1fe-4f7f-40ba-8532-82c8f78519ed",
    name: "Fashion Boutique",
    description: "Chuyên cung cấp các sản phẩm thời trang cao cấp, từ quần áo vintage đến các mẫu thiết kế hiện đại. Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm mua sắm tuyệt vời nhất.",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone_number: "0901 234 567",
    email: "contact@fashionboutique.com",
    avatar: null, // API trả về null
    background: null, // API trả về null
    rating: 0, // API trả về 0
    status: "UNVERIFIED", // API trả về UNVERIFIED
    created_at: "2025-09-22T13:21:37.865Z",
    updated_at: "2025-09-22T13:21:37.865Z",
  };

  // Fetch user's single shop - sử dụng user ID từ login
  const userId = getUserId();
  const shopId = userId || "e928f1fe-4f7f-40ba-8532-82c8f78519ed"; // Fallback nếu không có user ID
  const { data: shop, isLoading } = useQuery({
    queryKey: ["my-shop", shopId],
    queryFn: () => shopApi.getMyShop(),
    select: (res) => res.data as Shop,
    retry: false, // Không retry khi lỗi
    enabled: !!shopId, // Chỉ fetch khi có shop ID
  });

  // Use mock data if API fails
  const shopData = shop || mockShop;

  // Delete shop mutation
  const deleteShopMutation = useMutation({
    mutationFn: () => shopApi.delete(),
    onSuccess: () => {
      toast.success("Xóa shop thành công");
      queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      toast.error("Xóa shop thất bại");
      console.error("Delete shop error:", error);
    },
  });

  const handleDeleteShop = () => {
    deleteShopMutation.mutate();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Hoạt động</Badge>;
      case "UNVERIFIED":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ xác minh</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Tạm dừng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin shop...</p>
        </div>
      </div>
    );
  }

  // Không hiển thị error, sử dụng mock data thay thế

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý Shop</h1>
                <p className="text-gray-600 mt-1">
                  Quản lý shop của bạn
                </p>
              </div>
            </div>
            {!shop && (
              <button
                onClick={() => navigate("/shop/create")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Tạo Shop
              </button>
            )}
          </div>

          {/* Shop Content */}
          {shopData ? (
            <div className="space-y-6">
              {/* Shop Overview Card */}
              <Card className="overflow-hidden border-2 border-gray-100 shadow-lg">
                {/* Shop Header with Background */}
                <div className="relative h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                  <img
                    src={shopData.background || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&crop=center"}
                    alt={shopData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Decorative blobs */}
                  <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
                  <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    {getStatusBadge(shopData.status)}
                  </div>

                  {/* Shop Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-end gap-4">
                      <div className="relative">
                        <img
                          src={shopData.avatar || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center"}
                          alt={shopData.name}
                          className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-xl"
                        />
                        <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg">
                          <Camera className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="flex-1 text-white">
                        <h2 className="text-2xl font-bold mb-1">{shopData.name}</h2>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{shopData.rating || 0}</span>
                          </div>
                          <span>•</span>
                          <span>Tạo: {formatDate(shopData.created_at || "")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Details */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Description */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Mô tả shop</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {shopData.description}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shopData.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Địa chỉ</p>
                              <p className="text-sm text-gray-600">{shopData.address}</p>
                            </div>
                          </div>
                        )}
                        {shopData.phone_number && (
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Số điện thoại</p>
                              <p className="text-sm text-gray-600">{shopData.phone_number}</p>
                            </div>
                          </div>
                        )}
                        {shopData.email && (
                          <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Email</p>
                              <p className="text-sm text-gray-600">{shopData.email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Stats & Actions */}
                    <div className="space-y-4">
                      {/* Quick Stats */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3">Thống kê nhanh</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600">Sản phẩm</span>
                            </div>
                            <span className="font-bold text-gray-900">24</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600">Người theo dõi</span>
                            </div>
                            <span className="font-bold text-gray-900">156</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600">Doanh thu tháng</span>
                            </div>
                            <span className="font-bold text-gray-900">2.5M</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate(`/view-shop/${shopData.id}`)}
                          className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Xem shop công khai
                        </button>
                        <button
                          onClick={() => navigate("/shop/edit")}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa shop
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="w-full px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa shop
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1" onClick={() => navigate("/products")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Quản lý sản phẩm</p>
                      <p className="text-sm text-gray-600">24 sản phẩm</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Thống kê</p>
                      <p className="text-sm text-gray-600">Xem báo cáo</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Khách hàng</p>
                      <p className="text-sm text-gray-600">156 người theo dõi</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Cài đặt</p>
                      <p className="text-sm text-gray-600">Tùy chỉnh shop</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Store className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Chưa có shop
              </h3>
              <p className="text-gray-600 mb-6">
                Tạo shop để bắt đầu bán hàng và chia sẻ tủ đồ của bạn
              </p>
              <button
                onClick={() => navigate("/shop/create")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Tạo Shop
              </button>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && shop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Xác nhận xóa shop
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa shop <strong>"{shopData.name}"</strong>? 
                    Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      disabled={deleteShopMutation.isPending}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleDeleteShop}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-200"
                      disabled={deleteShopMutation.isPending}
                    >
                      {deleteShopMutation.isPending ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
