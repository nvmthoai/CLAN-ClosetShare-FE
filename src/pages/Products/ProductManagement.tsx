import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { productApi } from "@/apis/product.api";
import type { Product } from "@/models/Product";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Package,
  TrendingUp,
  Star,
  Calendar,
  DollarSign,
  Grid3X3,
  List,
  ChevronDown
} from "lucide-react";

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Áo sơ mi vintage trắng",
    description: "Áo sơ mi vintage chất liệu cotton cao cấp, thiết kế cổ điển phù hợp cho mọi dịp.",
    status: "ACTIVE",
    type: "Áo sơ mi",
    shop_id: "1",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    ],
    variants: [
      {
        id: "1",
        product_id: "1",
        name: "Size M",
        type: "size",
        stock: 15,
        status: "ACTIVE",
        imgs: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "1",
            variant_id: "1",
            price: 250000
          }
        ]
      },
      {
        id: "2",
        product_id: "1",
        name: "Size L",
        type: "size",
        stock: 8,
        status: "ACTIVE",
        imgs: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "2",
            variant_id: "2",
            price: 250000
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Quần jean skinny đen",
    description: "Quần jean skinny chất liệu denim cao cấp, form dáng ôm sát tôn dáng.",
    status: "ACTIVE",
    type: "Quần jean",
    shop_id: "1",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    ],
    variants: [
      {
        id: "3",
        product_id: "2",
        name: "Size 28",
        type: "size",
        stock: 12,
        status: "ACTIVE",
        imgs: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "3",
            variant_id: "3",
            price: 450000
          }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Đầm dạ hội đỏ",
    description: "Đầm dạ hội sang trọng, thiết kế tinh tế phù hợp cho các sự kiện quan trọng.",
    status: "ACTIVE",
    type: "Đầm",
    shop_id: "1",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    ],
    variants: [
      {
        id: "4",
        product_id: "3",
        name: "Size S",
        type: "size",
        stock: 5,
        status: "ACTIVE",
        imgs: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "4",
            variant_id: "4",
            price: 850000
          }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "Áo khoác denim xanh",
    description: "Áo khoác denim phong cách, chất liệu bền đẹp, dễ phối đồ.",
    status: "ACTIVE",
    type: "Áo khoác",
    shop_id: "1",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop"
    ],
    variants: [
      {
        id: "5",
        product_id: "4",
        name: "Size M",
        type: "size",
        stock: 20,
        status: "ACTIVE",
        imgs: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "5",
            variant_id: "5",
            price: 650000
          }
        ]
      }
    ]
  },
  {
    id: "5",
    name: "Váy maxi hoa",
    description: "Váy maxi in hoa nhẹ nhàng, phù hợp cho mùa hè và các dịp dạo phố.",
    status: "DRAFT",
    type: "Váy",
    shop_id: "1",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"
    ],
    variants: [
      {
        id: "6",
        product_id: "5",
        name: "Size M",
        type: "size",
        stock: 0,
        status: "INACTIVE",
        imgs: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop"],
        pricings: [
          {
            id: "6",
            variant_id: "6",
            price: 350000
          }
        ]
      }
    ]
  }
];

export default function ProductManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch products (using mock data for now)
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["products", { search: searchTerm, status: statusFilter, type: typeFilter }],
    queryFn: () => Promise.resolve({ 
      data: { 
        products: mockProducts, 
        total: mockProducts.length, 
        page: 1, 
        limit: 10, 
        totalPages: 1 
      } 
    }),
    select: (res) => res.data,
    // Uncomment below when you have real API
    // queryFn: () => productApi.getProducts({ shopId: "1" }),
    // select: (res) => res.data,
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => {
      // Mock delete - in real app, this would call productApi.deleteProduct(productId)
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowDeleteModal(false);
      setSelectedProduct(null);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
    },
  });

  // Duplicate product mutation
  const duplicateProductMutation = useMutation({
    mutationFn: (productId: string) => {
      // Mock duplicate - in real app, this would call productApi.actionOnProduct(productId, "duplicate")
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast.success("Nhân bản sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi nhân bản sản phẩm!");
    },
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Đang bán</Badge>;
      case "DRAFT":
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>;
      case "INACTIVE":
        return <Badge variant="secondary">Tạm dừng</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variants?.reduce((total, variant) => total + variant.stock, 0) || 0;
  };

  const getMinPrice = (product: Product) => {
    const prices = product.variants?.flatMap(variant => 
      variant.pricings?.map(pricing => pricing.price) || []
    ) || [];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
    }
  };

  const handleDuplicate = (product: Product) => {
    duplicateProductMutation.mutate(product.id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
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
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả sản phẩm trong shop của bạn
              </p>
            </div>
            <Button
              onClick={() => navigate("/products/create")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang bán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.status === "ACTIVE").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.status === "DRAFT").length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng kho</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((total, product) => total + getTotalStock(product), 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang bán</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="INACTIVE">Tạm dừng</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Áo sơ mi">Áo sơ mi</option>
                  <option value="Quần jean">Quần jean</option>
                  <option value="Đầm">Đầm</option>
                  <option value="Áo khoác">Áo khoác</option>
                  <option value="Váy">Váy</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn"
              }
            </p>
            <Button onClick={() => navigate("/products/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="relative">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/300x300"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(product.status || "DRAFT")}
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="relative group">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {selectedProduct?.id === product.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                              <button
                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="w-3 h-3" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDuplicate(product)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy className="w-3 h-3" />
                                Nhân bản
                              </button>
                              <button
                                onClick={() => navigate(`/products/${product.id}`)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-3 h-3" />
                                Xem chi tiết
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
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
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>Kho: {getTotalStock(product)}</span>
                        <span className="font-medium text-purple-600">
                          {getMinPrice(product).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.type}
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
                        src={product.images?.[0] || "https://via.placeholder.com/300x300"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          {getStatusBadge(product.status || "DRAFT")}
                        </div>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Kho: {getTotalStock(product)}</span>
                          <span>Giá: {getMinPrice(product).toLocaleString('vi-VN')}đ</span>
                          <span>Loại: {product.type}</span>
                          <span>{product.variants?.length || 0} biến thể</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa sản phẩm
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct.name}"? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteProductMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {deleteProductMutation.isPending ? "Đang xóa..." : "Xóa"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
