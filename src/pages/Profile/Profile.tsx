import Layout from "@/components/layout/Layout";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { outfitApi } from "@/apis/outfit.api";
import { getUserId } from "@/lib/user";
import type { User } from "@/models/User";
import type { Outfit, CreateOutfitPayload } from "@/models/Outfit";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus, Shirt, Sparkles, Heart, Share2, RefreshCw, X, Edit, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewType, setViewType] = useState("all");
  const [activeTab, setActiveTab] = useState<'profile' | 'outfits'>('profile');
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  // Sử dụng user ID từ login
  const userId = getUserId();

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
    onSuccess: () => {
      // Reset form and close modal
      setOutfitName("");
      setShowCreateOutfit(false);
      
      // Invalidate and refetch the outfits list
      queryClient.invalidateQueries({ queryKey: ["outfits", userId] });
    },
    onError: (error: any) => {
      if (error?.response?.data?.message) {
        alert(`Lỗi: ${error.response.data.message}`);
      }
    },
  });

  // Mock data for recently viewed and virtual closet
  const recentlyViewed = Array(5).fill(null);
  const virtualClosetItems = Array(6).fill(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20 bg-gradient-to-br from-white via-blue-50/20 to-white min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải hồ sơ...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-20 bg-gradient-to-br from-white via-blue-50/20 to-white min-h-screen">
          <div className="text-red-600 mb-4">Không thể tải hồ sơ</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
          >
            Thử lại
          </button>
        </div>
      </Layout>
    );
  }

  const userName = data?.name || "Shop/Business";
  const userAvatar = data?.avatarUrl;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "px-6 py-3 text-sm font-semibold transition-all duration-200 relative",
                activeTab === 'profile'
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Thông tin cá nhân
              {activeTab === 'profile' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              className={cn(
                "px-6 py-3 text-sm font-semibold transition-all duration-200 relative flex items-center gap-2",
                activeTab === 'outfits'
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Shirt className="w-4 h-4" />
              Tủ đồ của tôi
              {displayOutfits.length > 0 && (
                <Badge className="ml-1 bg-blue-500 text-white">
                  {displayOutfits.length}
                </Badge>
              )}
              {activeTab === 'outfits' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
              )}
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
              {/* Header with avatar and greeting */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-8 text-center relative overflow-hidden">
                {/* Decorative blobs */}
                <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
                <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
                
                <div className="w-24 h-24 mx-auto mb-4 relative z-10">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold border-4 border-white shadow-xl">
                      {userName.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold text-white mb-1 relative z-10">
                  Xin chào, {userName}!
                </h1>
                <p className="text-sm text-white/90 relative z-10">{data?.email}</p>
                
                {/* Edit button */}
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm z-10"
                  title="Chỉnh sửa hồ sơ"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Recently viewed section */}
              <div className="px-6 py-6 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  Đã xem gần đây
                </h2>
                <div className="flex gap-3">
                  {recentlyViewed.map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200"
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
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Tủ đồ ảo của tôi
                  </h2>
                  <div className="relative">
                    <select
                      value={viewType}
                      onChange={(e) => setViewType(e.target.value)}
                      className="appearance-none bg-transparent text-sm text-gray-600 pr-6 focus:outline-none cursor-pointer hover:text-gray-900 focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                    >
                      <option value="all">Xem tất cả</option>
                      <option value="favorites">Yêu thích</option>
                      <option value="recent">Gần đây</option>
                      <option value="sold">Đã bán</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Virtual closet grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {virtualClosetItems.map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center group cursor-pointer hover:bg-blue-50 transition-all duration-200 relative overflow-hidden"
                    >
                      {/* Placeholder clothing items */}
                      <div className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors">
                        {i % 3 === 0 ? "👗" : i % 3 === 1 ? "👚" : "👖"}
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all duration-200"></div>
                    </div>
                  ))}
                </div>

                {/* Add item button */}
                <button
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Thêm món đồ mới
                </button>
              </div>
            </div>
          )}

          {activeTab === 'outfits' && (
            <div className="space-y-8">
              {/* Outfits Header */}
              <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl">
                {/* Decorative blobs */}
                <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
                <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Tủ đồ của tôi</h2>
                      {outfitsLoading && (
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Đang tải...</span>
                        </div>
                      )}
                      {!outfitsLoading && !outfitsError && outfits.length > 0 && (
                        <Badge className="bg-blue-500 text-white">
                          {outfits.length} outfits
                        </Badge>
                      )}
                      {outfitsError && (
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>Đang dùng dữ liệu mẫu</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/90 text-base md:text-lg mb-4">
                      Quản lý và chia sẻ các outfit yêu thích của bạn
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span>Áo</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Quần</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span>Áo khoác</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span>Phụ kiện</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateOutfit(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
                  >
                    <Plus className="w-4 h-4" />
                    Tạo outfit mới
                  </button>
                </div>
              </div>

              {/* Outfits Grid */}
              {outfitsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : outfitsError ? (
                <div className="text-center py-20 bg-red-50 rounded-2xl border-2 border-red-200">
                  <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Không thể tải outfits từ server. Vui lòng thử lại sau.
                  </p>
                  <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["outfits", userId] })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Thử lại
                  </button>
                </div>
              ) : displayOutfits.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
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
                <div className="text-center py-20 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Shirt className="w-16 h-16 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Chưa có outfit nào
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    Tạo outfit đầu tiên để bắt đầu chia sẻ phong cách thời trang của bạn với cộng đồng
                  </p>
                  <button
                    onClick={() => setShowCreateOutfit(true)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 text-lg font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Tạo outfit đầu tiên
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Outfit Modal */}
      {showCreateOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tạo outfit mới</h2>
              <button
                onClick={() => setShowCreateOutfit(false)}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên outfit
                </label>
                <input
                  type="text"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Nhập tên outfit..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                <p>Outfit sẽ được tạo với tên "{outfitName || 'Outfit mới'}"</p>
                <p className="mt-1">Bạn có thể thêm quần áo sau khi tạo.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => setShowCreateOutfit(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (outfitName.trim()) {
                    createOutfitMutation.mutate({ name: outfitName.trim() });
                  }
                }}
                disabled={!outfitName.trim() || createOutfitMutation.isPending}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200"
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden group hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2">
      {/* Outfit Image Grid */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
          <Shirt className="w-16 h-16 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Chưa có items</span>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button
              className="p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
            </button>
            <button
              className="p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
            >
              <Share2 className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Outfit Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg truncate">{outfit.name}</h3>
        </div>
        
        {/* Empty state */}
        <div className="text-center py-4 mb-4 bg-gray-50 rounded-xl">
          <span className="text-gray-400 text-sm">Outfit trống</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Styling
          </button>
          <button className="px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
