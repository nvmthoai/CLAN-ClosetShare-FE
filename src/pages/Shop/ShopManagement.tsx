import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/apis/shop.api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Store,
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  Camera,
  Upload,
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

  // Mock data for single shop
  const mockShop: Shop = {
    id: "1",
    name: "Fashion Boutique",
    description: "Chuyên cung cấp các sản phẩm thời trang cao cấp, từ quần áo vintage đến các mẫu thiết kế hiện đại. Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm mua sắm tuyệt vời nhất.",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone_number: "0901 234 567",
    email: "contact@fashionboutique.com",
    avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center",
    background: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&crop=center",
    rating: 4.8,
    status: "ACTIVE",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T15:45:00Z",
  };

  // Fetch user's single shop (using mock data for now)
  const { data: shop, isLoading, isError } = useQuery({
    queryKey: ["my-shop"],
    queryFn: () => Promise.resolve({ data: mockShop }),
    select: (res) => res.data as Shop,
    // Uncomment below when you have real API
    // queryFn: () => shopApi.getMyShop(),
    // select: (res) => res.data as Shop,
  });

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
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case "UNVERIFIED":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác minh</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-red-100 text-red-800">Tạm dừng</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin shop...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 mb-4">Không thể tải thông tin shop</div>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Shop</h1>
            <p className="text-gray-600 mt-1">
              Quản lý shop của bạn
            </p>
          </div>
        </div>
        {!shop && (
          <Button
            onClick={() => navigate("/shop/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo Shop
          </Button>
        )}
      </div>

      {/* Shop Content */}
      {shop ? (
        <div className="space-y-6">
          {/* Shop Overview Card */}
          <Card className="overflow-hidden">
            {/* Shop Header with Background */}
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
              {shop.background && (
                <img
                  src={shop.background}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {getStatusBadge(shop.status)}
              </div>

              {/* Shop Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    {shop.avatar ? (
                      <img
                        src={shop.avatar}
                        alt={shop.name}
                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white border-4 border-white flex items-center justify-center">
                        <Store className="w-10 h-10 text-purple-600" />
                      </div>
                    )}
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-2xl font-bold mb-1">{shop.name}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{shop.rating}</span>
                      </div>
                      <span>•</span>
                      <span>Tạo: {formatDate(shop.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Description */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả shop</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {shop.description}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shop.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                          <p className="text-sm text-gray-600">{shop.address}</p>
                        </div>
                      </div>
                    )}
                    {shop.phone_number && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Số điện thoại</p>
                          <p className="text-sm text-gray-600">{shop.phone_number}</p>
                        </div>
                      </div>
                    )}
                    {shop.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{shop.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Stats & Actions */}
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Thống kê nhanh</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Sản phẩm</span>
                        </div>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">Người theo dõi</span>
                        </div>
                        <span className="font-semibold">156</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600">Doanh thu tháng</span>
                        </div>
                        <span className="font-semibold">2.5M</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/view-shop/${shop.id}`)}
                      className="w-full flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem shop công khai
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/shop/edit")}
                      className="w-full flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa shop
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa shop
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/products")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Quản lý sản phẩm</p>
                  <p className="text-sm text-gray-600">24 sản phẩm</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Thống kê</p>
                  <p className="text-sm text-gray-600">Xem báo cáo</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Khách hàng</p>
                  <p className="text-sm text-gray-600">156 người theo dõi</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cài đặt</p>
                  <p className="text-sm text-gray-600">Tùy chỉnh shop</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Store className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có shop
          </h3>
          <p className="text-gray-600 mb-6">
            Tạo shop để bắt đầu bán hàng và chia sẻ tủ đồ của bạn
          </p>
          <Button
            onClick={() => navigate("/shop/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo Shop
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && shop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa shop
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa shop <strong>"{shop.name}"</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                  disabled={deleteShopMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDeleteShop}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={deleteShopMutation.isPending}
                >
                  {deleteShopMutation.isPending ? "Đang xóa..." : "Xóa"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
