import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { shopApi } from "@/apis/shop.api";
import { getUserId } from "@/lib/user";
import type { User } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Store, Plus, Settings, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("all");
  const [activeTab, setActiveTab] = useState<'profile' | 'shops'>('profile');
  
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
  const shopId = userId || "e928f1fe-4f7f-40ba-8532-82c8f78519ed"; // Fallback nếu không có user ID
  const { data: myShop } = useQuery({
    queryKey: ["my-shop", shopId],
    queryFn: () => shopApi.getMyShop(),
    select: (res) => res.data,
    retry: false,
    enabled: !!shopId, // Chỉ fetch khi có shop ID
  });

  // Use mock data if API fails
  const shopData = myShop || mockShop;

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
    </Layout>
  );
}
