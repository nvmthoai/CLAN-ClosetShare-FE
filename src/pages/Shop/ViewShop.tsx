import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductsByShop } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { shopApi } from "@/apis/shop.api";
import { getUserId } from "@/lib/user";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag,
  Heart,
  Share2,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Mock data cho shop - phù hợp với API response
const mockShopData = {
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
  // Thêm thông tin mở rộng cho UI
  followers: 1250,
  following: 89,
  products_count: 156,
  reviews_count: 89,
  social_links: {
    instagram: "https://instagram.com/fashionboutique",
    facebook: "https://facebook.com/fashionboutique",
    twitter: "https://twitter.com/fashionboutique"
  },
  opening_hours: {
    monday: "9:00 - 21:00",
    tuesday: "9:00 - 21:00", 
    wednesday: "9:00 - 21:00",
    thursday: "9:00 - 21:00",
    friday: "9:00 - 22:00",
    saturday: "9:00 - 22:00",
    sunday: "10:00 - 20:00"
  }
};

// Mock data cho products
const mockProducts = [
  {
    id: "1",
    name: "Áo sơ mi vintage",
    price: 250000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
    category: "Áo sơ mi",
    rating: 4.5,
    sold: 12
  },
  {
    id: "2", 
    name: "Quần jean skinny",
    price: 450000,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
    category: "Quần jean",
    rating: 4.8,
    sold: 8
  },
  {
    id: "3",
    name: "Đầm dạ hội",
    price: 850000,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop",
    category: "Đầm",
    rating: 4.9,
    sold: 5
  },
  {
    id: "4",
    name: "Áo khoác denim",
    price: 650000,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
    category: "Áo khoác",
    rating: 4.6,
    sold: 15
  }
];

// Mock data cho reviews
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Nguyễn Thị Lan",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    rating: 5,
    comment: "Shop rất đẹp, sản phẩm chất lượng tốt. Nhân viên tư vấn nhiệt tình!",
    date: "2024-01-18T14:30:00Z",
    product: "Áo sơ mi vintage"
  },
  {
    id: "2",
    user: {
      name: "Trần Văn Minh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    rating: 4,
    comment: "Giao hàng nhanh, đóng gói cẩn thận. Sẽ quay lại mua tiếp!",
    date: "2024-01-17T09:15:00Z",
    product: "Quần jean skinny"
  },
  {
    id: "3",
    user: {
      name: "Lê Thị Hoa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    },
    rating: 5,
    comment: "Chất lượng vượt mong đợi, giá cả hợp lý. Rất hài lòng!",
    date: "2024-01-16T16:45:00Z",
    product: "Đầm dạ hội"
  }
];

export default function ViewShop() {
  const { id } = useParams<{ id: string }>();
  const userId = getUserId();
  // Sử dụng ID từ URL, hoặc user ID, hoặc fallback
  const shopId = id || userId || "e928f1fe-4f7f-40ba-8532-82c8f78519ed";
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [productType, setProductType] = useState("");

  // Fetch products from API (with mock data fallback)
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    isError: productsError 
  } = useProductsByShop(shopId, {
    page: currentPage,
    limit: 8,
    search: searchTerm || undefined,
    type: productType || undefined,
  });

  // Use API data if available, otherwise fallback to mock data
  const products = (productsData?.products || mockProducts) as any[];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.total || mockProducts.length;

  // Fetch shop data from API
  const { data: shopData } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => shopApi.getById(shopId),
    select: (res) => res.data,
    enabled: !!shopId,
    retry: false,
  });

  // Use API data if available, otherwise fallback to mock data
  const shop = shopData || mockShopData;
  const reviews = mockReviews;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
      {/* Header với background image */}
      <div className="relative h-64 md:h-80">
        <img
          src={shop.background || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&crop=center"}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Decorative blobs */}
        <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
        <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="absolute bottom-6 left-6 right-6 text-white z-10">
          <div className="flex items-end gap-4">
            <img
              src={shop.avatar || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"}
              alt={shop.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white object-cover shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{shop.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars(shop.rating || 0)}
                  <span className="ml-1">{shop.rating || 0}</span>
                </div>
                <span>•</span>
                <span>{shop.reviews_count || 0} đánh giá</span>
                <span>•</span>
                <span>{shop.products_count || 0} sản phẩm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              isFollowing
                ? "border-2 border-gray-200 text-gray-900 hover:bg-blue-50 hover:border-blue-300"
                : "bg-gray-900 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-200"
            }`}
          >
            {isFollowing ? "Đã theo dõi" : "Theo dõi"}
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            Yêu thích
          </button>
          <button className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 flex items-center gap-2 font-medium">
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </button>
          <button className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 flex items-center gap-2 font-medium">
            <MessageCircle className="w-4 h-4" />
            Liên hệ
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'products', label: 'Sản phẩm', count: products.length },
              { key: 'reviews', label: 'Đánh giá', count: reviews.length },
              { key: 'about', label: 'Giới thiệu' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-semibold text-sm transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Tất cả loại</option>
                  <option value="áo sơ mi">Áo sơ mi</option>
                  <option value="quần jean">Quần jean</option>
                  <option value="đầm">Đầm</option>
                  <option value="áo khoác">Áo khoác</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : productsError ? (
              <div className="text-center py-20 bg-red-50 rounded-2xl border-2 border-red-200">
                <div className="text-red-600 mb-4 font-semibold">Không thể tải sản phẩm</div>
                <p className="text-gray-600">Sử dụng dữ liệu mẫu</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 font-medium">
                    Hiển thị {products.length} sản phẩm (tổng {totalProducts})
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/95 text-gray-900 border-gray-200">
                    {product.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.sold} đã bán)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-500">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <button className="px-4 py-1.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 flex items-center gap-1 text-sm font-medium">
                      <ShoppingBag className="w-4 h-4" />
                      Mua
                    </button>
                  </div>
                </div>
              </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Trước
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? "bg-gray-900 text-white hover:bg-blue-500"
                                : "border-2 border-gray-200 text-gray-900 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                    >
                      Sau
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-bold text-gray-900">{review.user.name}</h4>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>
                    <Badge className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      Sản phẩm: {review.product}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Giới thiệu</h3>
                <p className="text-gray-700 leading-relaxed">{shop.description}</p>
              </Card>

              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3">
                  {shop.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{shop.address}</span>
                    </div>
                  )}
                  {shop.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{shop.phone_number}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{shop.email}</span>
                    </div>
                  )}
                </div>
              </Card>

              {shop.opening_hours && (
                <Card className="p-6 border-2 border-gray-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Giờ mở cửa</h3>
                  <div className="space-y-2">
                    {Object.entries(shop.opening_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="capitalize font-medium text-gray-900">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sản phẩm</span>
                    <span className="font-bold text-gray-900">{shop.products_count || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Đánh giá</span>
                    <span className="font-bold text-gray-900">{shop.reviews_count || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Người theo dõi</span>
                    <span className="font-bold text-gray-900">{shop.followers || 0}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Đang theo dõi</span>
                    <span className="font-bold text-gray-900">{shop.following || 0}</span>
                  </div>
                </div>
              </Card>

              {shop.social_links && (
                <Card className="p-6 border-2 border-gray-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Mạng xã hội</h3>
                  <div className="space-y-3">
                    {shop.social_links.instagram && (
                      <a
                        href={shop.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-500 transition-colors font-medium"
                      >
                        <Instagram className="w-5 h-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {shop.social_links.facebook && (
                      <a
                        href={shop.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-500 transition-colors font-medium"
                      >
                        <Facebook className="w-5 h-5" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {shop.social_links.twitter && (
                      <a
                        href={shop.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-500 transition-colors font-medium"
                      >
                        <Twitter className="w-5 h-5" />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
                </Card>
              )}

              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin shop</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Trạng thái</span>
                    <Badge className={shop.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                      {shop.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </div>
                  {shop.created_at && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ngày tạo</span>
                      <span className="font-medium text-gray-900">{formatDate(shop.created_at)}</span>
                    </div>
                  )}
                  {shop.updated_at && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Cập nhật</span>
                      <span className="font-medium text-gray-900">{formatDate(shop.updated_at)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}
