import Layout from "@/components/layout/Layout";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { shopApi } from "@/apis/shop.api";
import { outfitApi } from "@/apis/outfit.api";
import { getUserId } from "@/lib/user";
import type { User } from "@/models/User";
import type { Outfit, CreateOutfitPayload } from "@/models/Outfit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Store, Plus, Settings, MapPin, Phone, Mail, Shirt, Sparkles, Heart, Share2, MoreHorizontal, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewType, setViewType] = useState("all");
  const [activeTab, setActiveTab] = useState<'profile' | 'outfits' | 'shops'>('profile');
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  // Mock data for single shop - phù hợp với API response
  const mockShop = {
    id: "e928f1fe-4f7f-40ba-8532-82c8f78519ed",
    name: "Fashion Boutique",
    description: "Chuyên cung cấp các sản phẩm thời trang cao cấp, từ quần áo vintage đến các mẫu thiết kế hiện đại.",
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

  // Sử dụng user ID từ login
  const userId = getUserId();
  const { data: myShop, isError: shopError } = useQuery({
    queryKey: ["my-shop"],
    queryFn: () => shopApi.getMyShop(),
    select: (res) => res.data,
    retry: false,
    enabled: false, // Tạm thời disable để tránh lỗi 422
  });

  // Use mock data if API fails or no shop exists
  const shopData = myShop || (!shopError ? mockShop : null);


  // Fetch outfits for the current user
  const { data: outfits = [], isLoading: outfitsLoading, isError: outfitsError } = useQuery({
    queryKey: ["outfits", userId],
    queryFn: () => outfitApi.getOutfits({ userId: userId || "" }),
    select: (res: any) => {
      // Handle both direct array response and nested data response
      return Array.isArray(res.data) ? res.data : res.data?.data || res.data || [];
    },
    enabled: !!userId, // Enable API call when user ID is available
    retry: false,
  });

  // Use real data from API
  const displayOutfits = outfits;

  // Create outfit mutation
  const createOutfitMutation = useMutation({
    mutationFn: async (payload: CreateOutfitPayload) => {
      return await outfitApi.createOutfit(payload);
    },
    onSuccess: (data) => {
      // Add the new outfit to the list
      queryClient.setQueryData(["outfits", userId], (oldOutfits: Outfit[] | undefined) => {
        if (!oldOutfits) return [];
        return [data.data, ...oldOutfits];
      });
      // Reset form and close modal
      setOutfitName("");
      setShowCreateOutfit(false);
      alert(`Tạo outfit thành công!`);
    },
    onError: (error) => {
      console.error("Error creating outfit:", error);
      alert("Có lỗi xảy ra khi tạo outfit. Vui lòng thử lại.");
    },
  });

  // Mock data for recently viewed and virtual closet
  const recentlyViewed = Array(5).fill(null);
  const virtualClosetItems = Array(6).fill(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Failed to load profile</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  const userName = data?.name || "Shop/Business";
  const userAvatar = data?.avatarUrl;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'outfits'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shirt className="w-4 h-4" />
            Tủ đồ của tôi
            {displayOutfits.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {displayOutfits.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'shops'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store className="w-4 h-4" />
            Quản lý Shop
            {shopData && (
              <Badge variant="secondary" className="ml-1">
                {shopData.status === 'ACTIVE' ? 'Hoạt động' : 'Chờ xác minh'}
              </Badge>
            )}
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Header with avatar and greeting */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-semibold border-4 border-white shadow-lg">
                {userName.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Hello, {userName}!
          </h1>
          <p className="text-sm text-gray-600">{data?.email}</p>
        </div>

        {/* Recently viewed section */}
        <div className="px-6 py-6 border-b">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Recently viewed
          </h2>
          <div className="flex gap-3">
            {recentlyViewed.map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-300 cursor-pointer transition"
              >
                <div className="w-6 h-6 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Virtual Closet section */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">
              My Virtual Closet
            </h2>
            <div className="relative">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="appearance-none bg-transparent text-sm text-gray-600 pr-6 focus:outline-none cursor-pointer hover:text-gray-800"
              >
                <option value="all">View</option>
                <option value="favorites">Favorites</option>
                <option value="recent">Recent</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Virtual closet grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {virtualClosetItems.map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-200 transition relative overflow-hidden"
              >
                {/* Placeholder clothing items */}
                <div className="text-2xl text-gray-400 group-hover:text-gray-500 transition">
                  {i % 3 === 0 ? "👗" : i % 3 === 1 ? "👚" : "👖"}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
              </div>
            ))}
          </div>

          {/* Add item button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
          >
            <span className="text-lg mr-2">+</span>
            Add new item
          </Button>
        </div>
      </div>
        )}

        {activeTab === 'outfits' && (
          <div className="space-y-8">
            {/* Outfits Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">Tủ đồ của tôi</h2>
                    {outfitsLoading && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    )}
                    {!outfitsLoading && !outfitsError && outfits.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Dữ liệu thực từ server</span>
                      </div>
                    )}
                    {outfitsError && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span>Đang dùng dữ liệu mẫu</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-lg">
                    Quản lý và chia sẻ các outfit yêu thích của bạn
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Áo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Quần</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Áo khoác</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Phụ kiện</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["outfits"] })}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={outfitsLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${outfitsLoading ? 'animate-spin' : ''}`} />
                    Làm mới
                  </Button>
                  <Button
                    onClick={() => setShowCreateOutfit(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo outfit mới
                  </Button>
                </div>
              </div>
            </div>

            {/* Outfits Grid */}
            {outfitsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : outfitsError ? (
              <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200">
                <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Lỗi tải dữ liệu
                </h3>
                <p className="text-red-600 mb-6">
                  Không thể tải outfits từ server. Vui lòng thử lại sau.
                </p>
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["outfits", userId] })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Thử lại
                </Button>
              </div>
            ) : displayOutfits.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tất cả outfits ({displayOutfits.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Hiển thị {displayOutfits.length} outfits
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayOutfits.map((outfit: Outfit) => (
                    <OutfitCard key={outfit.id} outfit={outfit} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Shirt className="w-16 h-16 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Chưa có outfit nào
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Tạo outfit đầu tiên để bắt đầu chia sẻ phong cách thời trang của bạn với cộng đồng
                </p>
                <Button
                  onClick={() => setShowCreateOutfit(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-8 py-3 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  Tạo outfit đầu tiên
                </Button>
              </div>
            )}
      </div>
        )}

        {activeTab === 'shops' && (
          <div className="space-y-6">
            {/* Shop Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quản lý Shop</h2>
                <p className="text-gray-600 mt-1">
                  Quản lý shop của bạn
                </p>
              </div>
              {!shopData && (
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
            {shopData ? (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Shop Header */}
                <div className="relative h-32 bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={shopData.background || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&crop=center"}
                    alt={shopData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {shopData.status === 'ACTIVE' ? (
                      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    ) : shopData.status === 'UNVERIFIED' ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Chờ xác minh</Badge>
                    ) : (
                      <Badge variant="secondary">Tạm dừng</Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={shopData.avatar || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center"}
                        alt={shopData.name}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      />
                      <div className="text-white">
                        <h3 className="font-semibold">{shopData.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span>⭐ {shopData.rating || 0}</span>
                          <span>•</span>
                          <span>{new Date(shopData.created_at || "").toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Info */}
                <div className="p-4 space-y-4">
                  {shopData.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {shopData.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    {shopData.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{shopData.address}</span>
                      </div>
                    )}
                    {shopData.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{shopData.phone_number}</span>
                      </div>
                    )}
                    {shopData.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{shopData.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/view-shop/${shopData.id}`)}
                    >
                      Xem shop
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/shop/edit")}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
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
          </div>
        )}
      </div>

      {/* Create Outfit Modal */}
      {showCreateOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Tạo outfit mới</h2>
              <button
                onClick={() => setShowCreateOutfit(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên outfit
                </label>
                <input
                  type="text"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Nhập tên outfit..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>Outfit sẽ được tạo với tên "{outfitName || 'Outfit mới'}"</p>
                <p>Bạn có thể thêm quần áo sau khi tạo.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowCreateOutfit(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (outfitName.trim()) {
                    createOutfitMutation.mutate({
                      name: outfitName.trim(),
                      top: null,
                      bottom: null,
                      outwear: null,
                      accessories: []
                    });
                  }
                }}
                disabled={!outfitName.trim() || createOutfitMutation.isPending}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createOutfitMutation.isPending ? "Đang tạo..." : "Tạo outfit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// OutfitCard Component
function OutfitCard({ outfit }: { outfit: Outfit }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const clothingItems = [
    outfit.top,
    outfit.bottom,
    outfit.outwear,
    ...outfit.accessories
  ].filter(Boolean);

  const getClothingTypeIcon = (type: string) => {
    switch (type) {
      case "TOPS": return "👕";
      case "BOTTOMS": return "👖";
      case "OUTWEAR": return "🧥";
      case "ACCESSORIES": return "👜";
      default: return "👕";
    }
  };

  const getClothingTypeColor = (type: string) => {
    switch (type) {
      case "TOPS": return "bg-blue-500";
      case "BOTTOMS": return "bg-green-500";
      case "OUTWEAR": return "bg-purple-500";
      case "ACCESSORIES": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Outfit Image Grid */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {clothingItems.length > 0 ? (
          <div className="grid grid-cols-2 h-full">
            {clothingItems.slice(0, 4).map((item, index) => (
              <div key={item?.id || index} className="relative overflow-hidden group/item">
                <img
                  src={item?.image || ""}
                  alt={item?.name || ""}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-2xl">{getClothingTypeIcon(item?.type || "")}</span>
                </div>
                {/* Type indicator */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {item?.type || 'ITEM'}
                </div>
                {index === 3 && clothingItems.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{clothingItems.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
            <Shirt className="w-16 h-16 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Chưa có items</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 hover:bg-white shadow-lg"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Outfit Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg truncate">{outfit.name}</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowActions(!showActions)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Clothing Items List */}
        <div className="space-y-2 mb-4">
          {outfit.top && (
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-3 h-3 rounded-full ${getClothingTypeColor(outfit.top.type)}`}></div>
              <span className="text-gray-700 font-medium truncate">{outfit.top.name}</span>
              <span className="text-xs text-gray-500">({outfit.top.type})</span>
            </div>
          )}
          {outfit.bottom && (
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-3 h-3 rounded-full ${getClothingTypeColor(outfit.bottom.type)}`}></div>
              <span className="text-gray-700 font-medium truncate">{outfit.bottom.name}</span>
              <span className="text-xs text-gray-500">({outfit.bottom.type})</span>
            </div>
          )}
          {outfit.outwear && (
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-3 h-3 rounded-full ${getClothingTypeColor(outfit.outwear.type)}`}></div>
              <span className="text-gray-700 font-medium truncate">{outfit.outwear.name}</span>
              <span className="text-xs text-gray-500">({outfit.outwear.type})</span>
            </div>
          )}
          {outfit.accessories.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Phụ kiện ({outfit.accessories.length})</span>
              </div>
              {outfit.accessories.map((accessory) => (
                <div key={accessory.id} className="flex items-center gap-3 text-sm ml-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-700 font-medium truncate">{accessory.name}</span>
                  <span className="text-xs text-gray-500">({accessory.type})</span>
                </div>
              ))}
            </div>
          )}
          {clothingItems.length === 0 && (
            <div className="text-center py-4">
              <span className="text-gray-400 text-sm">Outfit trống</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700">
            <Sparkles className="w-3 h-3 mr-1" />
            Styling
          </Button>
          <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
            <Share2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
