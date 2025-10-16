import { useState } from "react";
import { useProductsByShop } from "@/hooks/useProducts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight,
  Settings
} from "lucide-react";

// Mock data fallback
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

interface ProductListProps {
  shopId: string;
  useMockData?: boolean;
}

export default function ProductList({ shopId, useMockData = false }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [productType, setProductType] = useState("");

  // Fetch products from API (only if not using mock data)
  const { 
    data: productsData, 
    isLoading, 
    isError 
  } = useProductsByShop(shopId, {
    page: currentPage,
    limit: 8,
    search: searchTerm || undefined,
    type: productType || undefined,
  });

  // Use mock data or API data
  const products = useMockData ? mockProducts : (productsData?.products || mockProducts);
  const totalPages = useMockData ? 1 : (productsData?.totalPages || 1);
  const totalProducts = useMockData ? mockProducts.length : (productsData?.total || mockProducts.length);

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
    <div className="space-y-6">
      {/* API/Mock Data Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Data Source:</span>
          <Badge variant={useMockData ? "secondary" : "default"}>
            {useMockData ? "Mock Data" : "API"}
          </Badge>
        </div>
        <div className="text-xs text-gray-500">
          {useMockData ? "Using sample data" : "Connected to API"}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={useMockData}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={useMockData}
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
      {isLoading && !useMockData ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải sản phẩm từ API...</p>
          </div>
        </div>
      ) : isError && !useMockData ? (
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Không thể tải sản phẩm từ API</div>
          <p className="text-gray-500">Đang sử dụng dữ liệu mẫu</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Hiển thị {products.length} sản phẩm (tổng {totalProducts})
            </p>
            {useMockData && (
              <Badge variant="outline" className="text-xs">
                Mock Data
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">
                    {product.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.sold} đã bán)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <Button size="sm" className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      Mua
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !useMockData && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
