import Layout from "@/components/layout/Layout";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { outfitApi, type UpdateOutfitItemsPayload } from "@/apis/outfit.api";
import { closetApi, type CreateClosetPayload, type ClosetItem } from "@/apis/closet.api";
import { getUserId } from "@/lib/user";
import type { User } from "@/models/User";
import type { Outfit, CreateOutfitPayload } from "@/models/Outfit";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus, Shirt, Sparkles, Heart, Share2, RefreshCw, X, Edit, User as UserIcon, Upload, Copy, Check } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { buildAppUrl } from "@/lib/url";
import { useSubscription } from "@/context/subscription";

const formatDateShort = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const subscription = useSubscription();
  const [viewType, setViewType] = useState("all");
  const [activeTab, setActiveTab] = useState<'profile' | 'outfits'>('profile');
  const [showCreateOutfit, setShowCreateOutfit] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  
  // Closet item form states
  const [showAddClosetItem, setShowAddClosetItem] = useState(false);
  const [closetForm, setClosetForm] = useState({
    name: "",
    type: "TOPS" as "TOPS" | "OUTWEAR" | "BOTTOMS" | "ACCESSORIES",
    image: null as File | null,
    imagePreview: null as string | null,
  });

  // Styling modal states
  const [showStylingModal, setShowStylingModal] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [selectedClosetItems, setSelectedClosetItems] = useState<string[]>([]);
  const [stylingFilter, setStylingFilter] = useState<string>("all");

  // Outfit detail modal states
  const [showOutfitDetail, setShowOutfitDetail] = useState(false);
  const [selectedOutfitDetailId, setSelectedOutfitDetailId] = useState<string | null>(null);

  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareOutfitId, setShareOutfitId] = useState<string | null>(null);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  // Sử dụng user ID từ login
  const userId = getUserId();

  // Fetch outfits for the current user
  // API: GET /outfits?userId={userId} or GET /outfits (with access token)
  const { data: outfits = [], isLoading: outfitsLoading, isError: outfitsError } = useQuery({
    queryKey: ["outfits", userId],
    queryFn: () => {
      // If userId is available, use it; otherwise rely on token
      if (userId) {
        return outfitApi.getOutfits({ userId });
      } else {
        // Call without userId - server will use token to identify user
        return outfitApi.getOutfits();
      }
    },
    select: (res: any) => {
      // API returns array directly: [{ id, name, user_id, top, bottom, outwear, accessories }, ...]
      const responseData = res.data;
      
      // If response.data is an array directly
      if (Array.isArray(responseData)) {
        return responseData;
      }
      
      // If response.data has a 'data' key containing the array
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      
      // Fallback
      return [];
    },
    enabled: true, // Always enabled - will use token if userId not available
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

  // Fetch closet items for profile tab
  const { data: closetItems = [], isLoading: closetLoading, refetch: refetchCloset } = useQuery({
    queryKey: ["closets", viewType],
    queryFn: () => closetApi.getAll({ type: viewType !== "all" ? viewType.toUpperCase() : undefined }),
    select: (res: any) => {
      const responseData = res.data;
      if (Array.isArray(responseData)) {
        return responseData;
      }
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      return [];
    },
    retry: false,
  });

  // Fetch closet items for styling modal
  const { data: stylingClosetData, isLoading: stylingClosetLoading } = useQuery({
    queryKey: ["closets", "styling", userId, stylingFilter],
    queryFn: () => closetApi.getAll({ 
      userId: userId || undefined,
      type: stylingFilter !== "all" ? stylingFilter.toUpperCase() : undefined 
    }),
    select: (res: any) => {
      const responseData = res.data;
      // Handle response format: { data: [...], pagination: {...} }
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return {
          items: responseData.data as ClosetItem[],
          pagination: responseData.pagination || { total: responseData.data.length, page: 1, total_pages: 1 }
        };
      }
      if (Array.isArray(responseData)) {
        return {
          items: responseData as ClosetItem[],
          pagination: { total: responseData.length, page: 1, total_pages: 1 }
        };
      }
      return { items: [], pagination: { total: 0, page: 1, total_pages: 1 } };
    },
    enabled: showStylingModal && !!userId,
    retry: false,
  });

  const stylingClosetItems = stylingClosetData?.items || [];

  // Fetch outfit details
  const { data: outfitDetail, isLoading: outfitDetailLoading } = useQuery({
    queryKey: ["outfit", selectedOutfitDetailId],
    queryFn: () => outfitApi.getById(selectedOutfitDetailId!),
    select: (res: any) => {
      const responseData = res.data;
      // Handle response format
      if (responseData && typeof responseData === 'object' && 'id' in responseData) {
        return responseData;
      }
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      return responseData;
    },
    enabled: !!selectedOutfitDetailId && showOutfitDetail,
    retry: false,
  });

  // Create closet item mutation
  const createClosetMutation = useMutation({
    mutationFn: async (payload: CreateClosetPayload) => {
      return await closetApi.create(payload);
    },
    onSuccess: () => {
      toast.success("Thêm món đồ vào tủ đồ thành công!");
      setShowAddClosetItem(false);
      setClosetForm({
        name: "",
        type: "TOPS",
        image: null,
        imagePreview: null,
      });
      refetchCloset();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Không thể thêm món đồ";
      toast.error(message);
    },
  });

  // Handle file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
        return;
      }
      setClosetForm({
        ...closetForm,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle submit closet item
  const handleSubmitClosetItem = () => {
    if (!closetForm.name.trim()) {
      toast.error("Vui lòng nhập tên món đồ");
      return;
    }
    if (!closetForm.image) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }
    
    createClosetMutation.mutate({
      name: closetForm.name.trim(),
      type: closetForm.type,
      image: closetForm.image,
    });
  };

  // Handle open styling modal
  const handleOpenStyling = (outfitId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedOutfitId(outfitId);
    setSelectedClosetItems([]);
    setStylingFilter("all");
    setShowStylingModal(true);
  };

  // Handle open outfit detail modal
  const handleOpenOutfitDetail = (outfitId: string) => {
    setSelectedOutfitDetailId(outfitId);
    setShowOutfitDetail(true);
  };

  // Handle open share modal
  const handleOpenShare = (outfitId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setShareOutfitId(outfitId);
    setShowShareModal(true);
  };

  // Get share URL - automatically uses current domain (works on localhost, Vercel, and any domain)
  const getShareUrl = (outfitId: string) => {
    return buildAppUrl(`/outfits/${outfitId}`);
  };

  // Handle toggle closet item selection
  const handleToggleClosetItem = (itemId: string) => {
    setSelectedClosetItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle save outfit styling
  const saveOutfitStylingMutation = useMutation({
    mutationFn: async (payload: UpdateOutfitItemsPayload) => {
      if (!selectedOutfitId) throw new Error("No outfit selected");
      return await outfitApi.updateOutfitItems(selectedOutfitId, payload);
    },
    onSuccess: () => {
      toast.success("Cập nhật outfit thành công!");
      setShowStylingModal(false);
      setSelectedOutfitId(null);
      setSelectedClosetItems([]);
      // Refresh outfits list
      queryClient.invalidateQueries({ queryKey: ["outfits", userId] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Không thể cập nhật outfit";
      toast.error(message);
    },
  });

  const handleSaveStyling = () => {
    if (selectedClosetItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một món đồ");
      return;
    }
    if (!selectedOutfitId) {
      toast.error("Không tìm thấy outfit");
      return;
    }
    
    saveOutfitStylingMutation.mutate({
      closet_item_ids: selectedClosetItems,
    });
  };

  // Mock data for recently viewed
  const recentlyViewed = Array(5).fill(null);
  
  // Filter closet items by viewType
  const filteredClosetItems = viewType === "all" 
    ? closetItems 
    : closetItems.filter((item: any) => item.type === viewType.toUpperCase());

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
  const userAvatar = data?.avatar || data?.avatarUrl;

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

              {subscription && (
                <div className="px-6 py-6 border-b border-gray-100 bg-white/70">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                        Gói đăng ký
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        <span
                          className={`px-3 py-1 rounded-full text-white shadow-lg ${
                            subscription.isPremier
                              ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
                              : "bg-gray-100 text-gray-600 shadow-none border border-gray-200"
                          }`}
                        >
                          {subscription.tierLabel}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase rounded-full px-3 py-1 ${
                        subscription.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {subscription.isActive ? "Còn hạn" : "Hết hạn"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">
                        Bắt đầu
                      </p>
                      <p className="font-medium">
                        {formatDateShort(subscription.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">
                        Kết thúc
                      </p>
                      <p className="font-medium">
                        {formatDateShort(subscription.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                      <option value="tops">Áo (TOPS)</option>
                      <option value="outwear">Áo khoác (OUTWEAR)</option>
                      <option value="bottoms">Quần (BOTTOMS)</option>
                      <option value="accessories">Phụ kiện (ACCESSORIES)</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Virtual closet grid */}
                {closetLoading ? (
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : filteredClosetItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {filteredClosetItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="aspect-square bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center group cursor-pointer hover:bg-blue-50 transition-all duration-200 relative overflow-hidden"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                      <div className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors">
                            {item.type === "TOPS" ? "👚" : item.type === "BOTTOMS" ? "👖" : item.type === "OUTWEAR" ? "🧥" : "👒"}
                      </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white font-medium truncate">{item.name}</p>
                        </div>
                    </div>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-8 mb-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có món đồ nào</p>
                  </div>
                )}

                {/* Add item button */}
                <button
                  onClick={() => setShowAddClosetItem(true)}
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
                      <OutfitCard 
                        key={outfit.id} 
                        outfit={outfit} 
                        onStylingClick={(e) => handleOpenStyling(outfit.id, e)}
                        onDetailClick={() => handleOpenOutfitDetail(outfit.id)}
                        onShareClick={(e) => handleOpenShare(outfit.id, e)}
                      />
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

      {/* Add Closet Item Modal */}
      {showAddClosetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Thêm món đồ vào tủ đồ
              </h2>
              <button
                onClick={() => {
                  setShowAddClosetItem(false);
                  setClosetForm({
                    name: "",
                    type: "TOPS",
                    image: null,
                    imagePreview: null,
                  });
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên món đồ *
                </label>
                <input
                  type="text"
                  value={closetForm.name}
                  onChange={(e) => setClosetForm({ ...closetForm, name: e.target.value })}
                  placeholder="Ví dụ: Áo sơ mi trắng"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Loại món đồ *
                </label>
                <select
                  value={closetForm.type}
                  onChange={(e) => setClosetForm({ 
                    ...closetForm, 
                    type: e.target.value as "TOPS" | "OUTWEAR" | "BOTTOMS" | "ACCESSORIES"
                  })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="TOPS">Áo (TOPS)</option>
                  <option value="OUTWEAR">Áo khoác (OUTWEAR)</option>
                  <option value="BOTTOMS">Quần (BOTTOMS)</option>
                  <option value="ACCESSORIES">Phụ kiện (ACCESSORIES)</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Hình ảnh *
                </label>
                
                {closetForm.imagePreview ? (
                  <div className="relative">
                    <img
                      src={closetForm.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      onClick={() => setClosetForm({ ...closetForm, image: null, imagePreview: null })}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click để chọn hình ảnh
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF tối đa 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="font-medium text-blue-900 mb-1">💡 Lưu ý:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• Chọn hình ảnh rõ ràng để AI có thể nhận diện tốt hơn</li>
                  <li>• Tên món đồ nên mô tả rõ ràng (ví dụ: "Áo sơ mi trắng dài tay")</li>
                  <li>• Chọn đúng loại để dễ quản lý tủ đồ</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAddClosetItem(false);
                  setClosetForm({
                    name: "",
                    type: "TOPS",
                    image: null,
                    imagePreview: null,
                  });
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitClosetItem}
                disabled={!closetForm.name.trim() || !closetForm.image || createClosetMutation.isPending}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200 flex items-center gap-2"
              >
                {createClosetMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Thêm vào tủ đồ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styling Modal */}
      {showStylingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Styling Outfit</h2>
                  <p className="text-sm text-gray-500">Chọn các món đồ từ tủ đồ của bạn</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStylingModal(false);
                  setSelectedOutfitId(null);
                  setSelectedClosetItems([]);
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Section */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Lọc theo loại:</span>
                <div className="flex gap-2 flex-wrap">
                  {["all", "tops", "bottoms", "outwear", "accessories"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setStylingFilter(type)}
                      className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                        stylingFilter === type
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      {type === "all" ? "Tất cả" : 
                       type === "tops" ? "Áo" :
                       type === "bottoms" ? "Quần" :
                       type === "outwear" ? "Áo khoác" : "Phụ kiện"}
                    </button>
                  ))}
                </div>
                {selectedClosetItems.length > 0 && (
                  <div className="ml-auto">
                    <Badge className="bg-blue-500 text-white">
                      Đã chọn: {selectedClosetItems.length}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {stylingClosetLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Đang tải tủ đồ...</p>
                </div>
              ) : stylingClosetItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stylingClosetItems.map((item: ClosetItem) => {
                    const isSelected = selectedClosetItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleClosetItem(item.id)}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 group",
                          isSelected
                            ? "border-blue-500 ring-4 ring-blue-200 shadow-lg scale-105"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        )}
                      >
                        {/* Image */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Shirt className="w-12 h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className={cn(
                          "absolute inset-0 transition-all duration-200",
                          isSelected ? "bg-blue-500/30" : "bg-black/0 group-hover:bg-black/20"
                        )}>
                          {/* Checkbox */}
                          <div className="absolute top-2 right-2">
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-blue-500 border-blue-500"
                                : "bg-white/90 border-gray-300 group-hover:border-blue-400"
                            )}>
                              {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Item Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-sm font-medium truncate">{item.name}</p>
                            <Badge className="mt-1 text-xs bg-white/20 text-white border-white/30">
                              {item.type === "TOPS" ? "Áo" :
                               item.type === "BOTTOMS" ? "Quần" :
                               item.type === "OUTWEAR" ? "Áo khoác" : "Phụ kiện"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có món đồ nào
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {stylingFilter !== "all" 
                      ? `Không có món đồ loại "${stylingFilter}" trong tủ đồ của bạn`
                      : "Thêm món đồ vào tủ đồ để bắt đầu styling"}
                  </p>
                  {stylingFilter === "all" && (
                    <button
                      onClick={() => {
                        setShowStylingModal(false);
                        setActiveTab('profile');
                      }}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium"
                    >
                      Thêm món đồ mới
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl flex-shrink-0">
              <div className="text-sm text-gray-600">
                {selectedClosetItems.length > 0 ? (
                  <span className="font-medium text-gray-900">
                    Đã chọn {selectedClosetItems.length} món đồ
                  </span>
                ) : (
                  <span>Chọn ít nhất một món đồ để lưu</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStylingModal(false);
                    setSelectedOutfitId(null);
                    setSelectedClosetItems([]);
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveStyling}
                  disabled={selectedClosetItems.length === 0 || saveOutfitStylingMutation.isPending}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200 flex items-center gap-2"
                >
                  {saveOutfitStylingMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Lưu outfit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outfit Detail Modal */}
      {showOutfitDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {outfitDetailLoading ? "Đang tải..." : outfitDetail?.name || "Chi tiết Outfit"}
                  </h2>
                  <p className="text-sm text-gray-500">Xem chi tiết các món đồ trong outfit</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowOutfitDetail(false);
                  setSelectedOutfitDetailId(null);
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {outfitDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Đang tải chi tiết outfit...</p>
                </div>
              ) : outfitDetail ? (
                <div className="space-y-6">
                  {/* Outfit Items Grid - Large View */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Top */}
                    {outfitDetail.top ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                        <img
                          src={outfitDetail.top.image}
                          alt={outfitDetail.top.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className="mb-2 bg-blue-500 text-white">
                              Áo
                            </Badge>
                            <h3 className="text-white font-bold text-lg">{outfitDetail.top.name}</h3>
                            <p className="text-white/80 text-sm mt-1">TOPS</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                        <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                        <p className="text-gray-400 font-medium">Chưa có áo</p>
                        <Badge className="mt-2 bg-gray-200 text-gray-600">TOPS</Badge>
                      </div>
                    )}

                    {/* Bottom */}
                    {outfitDetail.bottom ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                        <img
                          src={outfitDetail.bottom.image}
                          alt={outfitDetail.bottom.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className="mb-2 bg-green-500 text-white">
                              Quần
                            </Badge>
                            <h3 className="text-white font-bold text-lg">{outfitDetail.bottom.name}</h3>
                            <p className="text-white/80 text-sm mt-1">BOTTOMS</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                        <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                        <p className="text-gray-400 font-medium">Chưa có quần</p>
                        <Badge className="mt-2 bg-gray-200 text-gray-600">BOTTOMS</Badge>
                      </div>
                    )}

                    {/* Outwear */}
                    {outfitDetail.outwear ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                        <img
                          src={outfitDetail.outwear.image}
                          alt={outfitDetail.outwear.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className="mb-2 bg-purple-500 text-white">
                              Áo khoác
                            </Badge>
                            <h3 className="text-white font-bold text-lg">{outfitDetail.outwear.name}</h3>
                            <p className="text-white/80 text-sm mt-1">OUTWEAR</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                        <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                        <p className="text-gray-400 font-medium">Chưa có áo khoác</p>
                        <Badge className="mt-2 bg-gray-200 text-gray-600">OUTWEAR</Badge>
                      </div>
                    )}

                    {/* Accessories */}
                    {outfitDetail.accessories && outfitDetail.accessories.length > 0 ? (
                      <div className="relative aspect-square rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden">
                        <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                          {outfitDetail.accessories.map((acc: any, idx: number) => (
                            <div key={acc.id || idx} className="relative overflow-hidden rounded-lg">
                              <img
                                src={acc.image}
                                alt={acc.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-xs text-white font-medium truncate">{acc.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-yellow-500 text-white">
                            {outfitDetail.accessories.length} phụ kiện
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                        <Sparkles className="w-16 h-16 text-gray-300 mb-2" />
                        <p className="text-gray-400 font-medium">Chưa có phụ kiện</p>
                        <Badge className="mt-2 bg-gray-200 text-gray-600">ACCESSORIES</Badge>
                      </div>
                    )}
                  </div>

                  {/* Accessories Detail List */}
                  {outfitDetail.accessories && outfitDetail.accessories.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Phụ kiện ({outfitDetail.accessories.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {outfitDetail.accessories.map((acc: any, idx: number) => (
                          <div
                            key={acc.id || idx}
                            className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-md group hover:shadow-lg transition-all"
                          >
                            <img
                              src={acc.image}
                              alt={acc.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-medium text-sm truncate">{acc.name}</p>
                                <Badge className="mt-1 text-xs bg-yellow-500 text-white">ACCESSORIES</Badge>
                              </div>
                            </div>
                          </div>
                          
                        ))}
                      </div>
                    </div>
                  )}

                  
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không tìm thấy outfit
                  </h3>
                  <p className="text-gray-600">
                    Không thể tải thông tin chi tiết của outfit này
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl flex-shrink-0">
              <button
                onClick={() => {
                  if (selectedOutfitDetailId) {
                    handleOpenStyling(selectedOutfitDetailId);
                    setShowOutfitDetail(false);
                  }
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Chỉnh sửa Styling
              </button>
              <button
                onClick={() => {
                  setShowOutfitDetail(false);
                  setSelectedOutfitDetailId(null);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal with QR Code */}
      {showShareModal && shareOutfitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Chia sẻ Outfit</h2>
                  <p className="text-sm text-gray-500">Quét QR code để xem outfit</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareOutfitId(null);
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col items-center space-y-6">
                {/* QR Code */}
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                  <QRCodeSVG
                    value={getShareUrl(shareOutfitId)}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#1f2937"
                    bgColor="#ffffff"
                  />
                </div>

                {/* Share URL */}
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Link chia sẻ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl(shareOutfitId)}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm"
                    />
                    <CopyButton text={getShareUrl(shareOutfitId)} />
                  </div>
                </div>

                {/* Instructions */}
                <div className="w-full bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-900 font-medium mb-2">📱 Cách sử dụng:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Quét QR code bằng camera điện thoại</li>
                    <li>Hoặc copy link và gửi cho bạn bè</li>
                    <li>Người nhận sẽ thấy outfit của bạn</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareOutfitId(null);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// Copy Button Component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 flex items-center gap-2 font-medium"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm">Đã copy</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span className="text-sm">Copy</span>
        </>
      )}
    </button>
  );
}

// OutfitCard Component
function OutfitCard({ outfit, onStylingClick, onDetailClick, onShareClick }: { outfit: any; onStylingClick: (e?: React.MouseEvent) => void; onDetailClick: () => void; onShareClick: (e?: React.MouseEvent) => void }) {
  const [isLiked, setIsLiked] = useState(false);
  
  // Extract items from outfit (support both formats)
  const top = outfit.top || null;
  const bottom = outfit.bottom || null;
  const outwear = outfit.outwear || null;
  const accessories = outfit.accessories || [];
  
  // Check if outfit has any items
  const hasItems = top || bottom || outwear || accessories.length > 0;
  
  // Get item type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "TOPS": return "Áo";
      case "BOTTOMS": return "Quần";
      case "OUTWEAR": return "Áo khoác";
      case "ACCESSORIES": return "Phụ kiện";
      default: return type;
    }
  };

  return (
    <div 
      onClick={onDetailClick}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden group hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
    >
      {/* Outfit Items Grid */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {hasItems ? (
          <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
            {/* Top */}
            {top ? (
              <div className="relative overflow-hidden rounded-lg bg-white">
                <img
                  src={top.image}
                  alt={top.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{top.name}</p>
                  <p className="text-[10px] text-white/80">{getTypeLabel(top.type)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shirt className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Áo</span>
                </div>
              </div>
            )}

            {/* Bottom */}
            {bottom ? (
              <div className="relative overflow-hidden rounded-lg bg-white">
                <img
                  src={bottom.image}
                  alt={bottom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{bottom.name}</p>
                  <p className="text-[10px] text-white/80">{getTypeLabel(bottom.type)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shirt className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Quần</span>
                </div>
              </div>
            )}

            {/* Outwear */}
            {outwear ? (
              <div className="relative overflow-hidden rounded-lg bg-white">
                <img
                  src={outwear.image}
                  alt={outwear.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{outwear.name}</p>
                  <p className="text-[10px] text-white/80">{getTypeLabel(outwear.type)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shirt className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Áo khoác</span>
                </div>
              </div>
            )}

            {/* Accessories */}
            {accessories.length > 0 ? (
              <div className="relative overflow-hidden rounded-lg bg-white">
                <div className="w-full h-full grid grid-cols-2 gap-0.5">
                  {accessories.slice(0, 4).map((acc: any, idx: number) => (
                    <div key={acc.id || idx} className="relative overflow-hidden">
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {accessories.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                    <p className="text-[10px] text-white font-medium">
                      {accessories.length} phụ kiện
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-[10px] text-gray-400">Phụ kiện</span>
                </div>
              </div>
            )}
          </div>
        ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
          <Shirt className="w-16 h-16 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Chưa có items</span>
        </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button
              className="p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
            </button>
            <button
              className="p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Outfit Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg truncate flex-1">{outfit.name}</h3>
        </div>
        
        {/* Items Summary */}
        {hasItems && (
          <div className="flex flex-wrap gap-2 mb-4">
            {top && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                {getTypeLabel(top.type)}
              </Badge>
            )}
            {bottom && (
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {getTypeLabel(bottom.type)}
              </Badge>
            )}
            {outwear && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                {getTypeLabel(outwear.type)}
              </Badge>
            )}
            {accessories.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                {accessories.length} phụ kiện
              </Badge>
            )}
        </div>
        )}

        {/* Empty state message */}
        {!hasItems && (
          <div className="text-center py-3 mb-4 bg-gray-50 rounded-xl">
            <span className="text-gray-400 text-sm">Outfit trống - Thêm items để hoàn thiện</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStylingClick();
            }}
            className="flex-1 px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Styling
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onShareClick(e);
            }}
            className="px-4 py-2 text-sm font-medium border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
          >
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
