import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/models/Product";
import { productApi } from "@/apis/product.api";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  Star,
  DollarSign,
  Grid3X3,
  List,
  ChevronDown
} from "lucide-react";


export default function ProductManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Update URL when search or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (typeFilter && typeFilter !== "all") {
      params.set("type", typeFilter);
    }
    setSearchParams(params, { replace: true });
  }, [searchTerm, typeFilter, setSearchParams]);

  // Fetch products from API
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products", { search: searchTerm, type: typeFilter }],
    queryFn: () => productApi.getProducts({ 
      search: searchTerm || undefined,
      type: typeFilter !== "all" ? (typeFilter as "SALE" | "RENT") : undefined,
      page: 1,
      limit: 100,
    }),
    select: (res) => res.data,
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDeleteModal(false);
      setSelectedProduct(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm!";
      toast.error(message);
    },
  });

  const products = productsData?.data || [];
  const totalProducts = productsData?.pagination?.total || 0;

  // Filter products (search is handled by backend, but we can filter by status client-side if needed)
  const filteredProducts = products.filter(product => {
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    return matchesType;
  });

  const getStatusBadge = (product: Product) => {
    // Products from backend are always ACTIVE (inactive ones are filtered out)
    // But we can check if product has variants
    const hasActiveVariants = product.variants && product.variants.length > 0;
    if (hasActiveVariants) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Đang bán</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chưa có biến thể</Badge>;
  };

  const getTotalStock = (product: Product) => {
    return product.variants?.reduce((total, variant) => total + variant.stock, 0) || 0;
  };

  const getMinPrice = (product: Product) => {
    const prices = product.variants
      ?.map(variant => variant.pricing?.price)
      .filter((price): price is number => price !== undefined && price !== null) || [];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
    }
  };


  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Không thể tải sản phẩm</div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
          >
            Thử lại
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả sản phẩm trong shop của bạn
              </p>
            </div>
            <button
              onClick={() => navigate("/products/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Đang bán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.variants && p.variants.length > 0).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Chưa có biến thể</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => !p.variants || p.variants.length === 0).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Tổng kho</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((total, product) => total + getTotalStock(product), 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6 border-2 border-gray-100 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="SALE">Bán</option>
                  <option value="RENT">Thuê</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center border-2 border-gray-100 shadow-lg">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || typeFilter !== "all"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn"
              }
            </p>
            <button
              onClick={() => navigate("/products/create")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="relative">
                      <img
                        src={product.variants?.[0]?.images?.[0] || "https://via.placeholder.com/300x300"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(product)}
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="relative group">
                          <button
                            className="w-8 h-8 p-0 bg-white/95 hover:bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-blue-300 transition-all"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <MoreVertical className="w-4 h-4 text-gray-900" />
                          </button>
                          {selectedProduct?.id === product.id && (
                            <div className="absolute right-0 top-8 bg-white border-2 border-gray-200 rounded-xl shadow-xl py-1 z-10 min-w-[140px]">
                              <button
                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-500 flex items-center gap-2 transition-colors rounded-lg mx-1"
                              >
                                <Edit className="w-3 h-3" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => navigate(`/products/${product.id}`)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-500 flex items-center gap-2 transition-colors rounded-lg mx-1"
                              >
                                <Eye className="w-3 h-3" />
                                Xem chi tiết
                              </button>
                              <hr className="my-1 border-gray-200" />
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors rounded-lg mx-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description || "Không có mô tả"}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>Kho: {getTotalStock(product)}</span>
                        <span className="font-bold text-blue-500">
                          {getMinPrice(product).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.type === "SALE" ? "Bán" : "Thuê"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {product.variants?.length || 0} biến thể
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.variants?.[0]?.images?.[0] || "https://via.placeholder.com/300x300"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          {getStatusBadge(product)}
                        </div>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {product.description || "Không có mô tả"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Kho: {getTotalStock(product)}</span>
                          <span>Giá: {getMinPrice(product).toLocaleString('vi-VN')}đ</span>
                          <span>Loại: {product.type === "SALE" ? "Bán" : "Thuê"}</span>
                          <span>{product.variants?.length || 0} biến thể</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="p-2 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="p-2 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 border-2 border-red-200 rounded-xl text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="p-6 max-w-md mx-4 border-2 border-gray-100 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Xác nhận xóa sản phẩm
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct.name}"? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteProductMutation.isPending}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteProductMutation.isPending ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </Card>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}
