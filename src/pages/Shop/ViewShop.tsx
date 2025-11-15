import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { shopApi } from "@/apis/shop.api";
import { productApi } from "@/apis/product.api";
import { ProductCard } from "@/components/products/ProductCard";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Store,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Package,
  X,
  ChevronRight
} from "lucide-react";

export default function ViewShop() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const productsLimit = 10;

  // Fetch shop data from API
  const { data: shopData, isLoading, isError } = useQuery({
    queryKey: ["shop", id],
    queryFn: () => shopApi.getById(id!),
    select: (res) => {
      // Handle response format: could be direct object or { data: {...} }
      const responseData = res.data;
      if (responseData && typeof responseData === 'object' && 'id' in responseData) {
        return responseData;
      }
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return (responseData as any).data;
      }
      return responseData;
    },
    enabled: !!id,
    retry: false,
  });

  const shop = shopData;

  // Fetch products by shop
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    isError: productsError 
  } = useQuery({
    queryKey: ["products", "shop", id, productsPage, productsLimit],
    queryFn: () => productApi.getProducts({
      shopId: id,
      page: productsPage,
      limit: productsLimit,
    }),
    select: (res) => {
      const responseData = res.data;
      if (Array.isArray(responseData)) {
        return { products: responseData, total: responseData.length };
      }
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return { 
          products: responseData.data, 
          total: responseData.pagination?.total || responseData.data.length 
        };
      }
      if (responseData && typeof responseData === 'object' && 'products' in responseData) {
        return responseData as { products: any[]; total?: number };
      }
      return { products: [], total: 0 };
    },
    enabled: !!id && showProducts,
    refetchOnWindowFocus: false,
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / productsLimit);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Đang hoạt động
          </Badge>
        );
      case "UNVERIFIED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ xác minh
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status || "Không xác định"}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin shop...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !shop) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy shop</h2>
            <p className="text-gray-600 mb-6">
              Shop này không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
            >
              Quay lại danh sách shop
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative">
          {/* Background Image */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            {shop.background ? (
              <img
                src={shop.background}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
                <Store className="w-24 h-24 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    {shop.avatar ? (
                      <img
                        src={shop.avatar}
                        alt={shop.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white object-cover shadow-2xl"
                      />
                    ) : (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-2xl">
                        <Store className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Shop Info */}
                  <div className="flex-1 text-white">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                          {shop.name}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(shop.status)}
                          {shop.rating !== undefined && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              {renderStars(shop.rating)}
                              <span className="font-semibold">{shop.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {shop.description && (
                      <p className="text-white/90 text-sm md:text-base max-w-3xl leading-relaxed mb-4">
                        {shop.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        isLiked
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-500" />
                  Thông tin liên hệ
                </h2>
                <div className="space-y-4">
                  {shop.address && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Địa chỉ</p>
                        <p className="text-gray-900">{shop.address}</p>
                      </div>
                    </div>
                  )}

                  {shop.phone_number && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Số điện thoại</p>
                        <a
                          href={`tel:${shop.phone_number}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {shop.phone_number}
                        </a>
                      </div>
                    </div>
                  )}

                  {shop.email && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                        <a
                          href={`mailto:${shop.email}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {shop.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* About Section */}
              {shop.description && (
                <Card className="p-6 border-2 border-gray-100 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {shop.description}
                  </p>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Shop Details Card */}
              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin shop</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    {getStatusBadge(shop.status)}
                  </div>
                  
                  {shop.rating !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Đánh giá</span>
                      <div className="flex items-center gap-2">
                        {renderStars(shop.rating)}
                        <span className="font-semibold text-gray-900">{shop.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  {shop.created_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Ngày tạo
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(shop.created_at)}
                      </span>
                    </div>
                  )}

                  {shop.updated_at && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Cập nhật
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(shop.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 border-2 border-gray-100 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowProducts(!showProducts)}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    {showProducts ? "Ẩn sản phẩm" : "Xem sản phẩm"}
                  </button>
                  <button className="w-full px-4 py-3 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium text-sm">
                    Liên hệ shop
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Products Section */}
          {showProducts && (
            <div className="mt-8">
              <Card className="p-6 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Sản phẩm của shop</h2>
                      <p className="text-sm text-gray-600">
                        {totalProducts > 0 ? `${totalProducts} sản phẩm` : "Đang tải..."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProducts(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {productsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="space-y-2 animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-lg" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : productsError ? (
                  <div className="text-center py-12 bg-red-50 rounded-xl border-2 border-red-200">
                    <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <p className="font-semibold text-red-600 mb-2">Không thể tải sản phẩm</p>
                    <p className="text-sm text-gray-600">Vui lòng thử lại sau</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</p>
                    <p className="text-sm text-gray-600">Shop này chưa đăng sản phẩm</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                          disabled={productsPage === 1 || productsLoading}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Trước
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                          Trang {productsPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setProductsPage((p) => Math.min(totalPages, p + 1))}
                          disabled={productsPage >= totalPages || productsLoading}
                          className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-1"
                        >
                          Sau
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
