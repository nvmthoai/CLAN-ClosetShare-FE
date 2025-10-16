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
  MoreVertical,
  Store,
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings
} from "lucide-react";
import type { Shop } from "@/models/Shop";

export default function ShopManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data for testing
  const mockShops: Shop[] = [
    {
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
    },
    {
      id: "2",
      name: "Vintage Store",
      description: "Cửa hàng chuyên về quần áo vintage và retro. Tìm kiếm những món đồ độc đáo từ những thập niên trước.",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      phone_number: "0902 345 678",
      email: "info@vintagestore.vn",
      avatar: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop&crop=center",
      background: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=200&fit=crop&crop=center",
      rating: 4.5,
      status: "UNVERIFIED",
      created_at: "2024-01-10T14:20:00Z",
      updated_at: "2024-01-18T09:15:00Z",
    },
    {
      id: "3",
      name: "Modern Style",
      description: "Thời trang hiện đại cho giới trẻ năng động. Phong cách trẻ trung, năng động và cá tính.",
      address: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
      phone_number: "0903 456 789",
      email: "hello@modernstyle.com",
      avatar: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop&crop=center",
      background: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop&crop=center",
      rating: 4.2,
      status: "ACTIVE",
      created_at: "2024-01-05T08:45:00Z",
      updated_at: "2024-01-22T16:30:00Z",
    }
  ];

  // Fetch user's shops (using mock data for now)
  const { data: shops, isLoading, isError } = useQuery({
    queryKey: ["my-shops"],
    queryFn: () => Promise.resolve({ data: mockShops }),
    select: (res) => res.data as Shop[],
    // Uncomment below when you have real API
    // queryFn: () => shopApi.getMyShops(),
    // select: (res) => res.data as Shop[],
  });

  // Delete shop mutation
  const deleteShopMutation = useMutation({
    mutationFn: (id: string) => shopApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa shop thành công");
      queryClient.invalidateQueries({ queryKey: ["my-shops"] });
      setShowDeleteModal(false);
      setSelectedShop(null);
    },
    onError: (error: any) => {
      toast.error("Xóa shop thất bại");
      console.error("Delete shop error:", error);
    },
  });

  const handleDeleteShop = () => {
    if (selectedShop) {
      deleteShopMutation.mutate(selectedShop.id);
    }
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
          <p className="text-gray-500">Đang tải danh sách shop...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 mb-4">Không thể tải danh sách shop</div>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Shop</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các shop của bạn ({shops?.length || 0} shop)
          </p>
        </div>
        <Button
          onClick={() => navigate("/shop/create")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tạo Shop Mới
        </Button>
      </div>

      {/* Shops Grid */}
      {shops && shops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Shop Header */}
              <div className="relative h-32 bg-gradient-to-br from-purple-100 to-pink-100">
                {shop.background && (
                  <img
                    src={shop.background}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(shop.status)}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    {shop.avatar ? (
                      <img
                        src={shop.avatar}
                        alt={shop.name}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center">
                        <Store className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    <span className="text-white font-medium text-sm bg-black/20 px-2 py-1 rounded">
                      {shop.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shop Info */}
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  {shop.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {shop.description}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    {shop.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{shop.address}</span>
                      </div>
                    )}
                    {shop.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{shop.phone_number}</span>
                      </div>
                    )}
                    {shop.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{shop.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Tạo: {formatDate(shop.created_at)}</span>
                    </div>
                    {shop.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{shop.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/view-shop/${shop.id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/shop/edit/${shop.id}`)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedShop(shop);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Store className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có shop nào
          </h3>
          <p className="text-gray-600 mb-6">
            Tạo shop đầu tiên của bạn để bắt đầu bán hàng
          </p>
          <Button
            onClick={() => navigate("/shop/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo Shop Mới
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedShop && (
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
                Bạn có chắc chắn muốn xóa shop <strong>"{selectedShop.name}"</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedShop(null);
                  }}
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
