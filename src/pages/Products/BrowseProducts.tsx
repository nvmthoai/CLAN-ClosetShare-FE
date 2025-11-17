import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { productApi } from "@/apis/product.api";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/models/Product";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Search,
  Grid3X3,
  List,
  Package,
  TrendingUp,
  ChevronDown,
  X,
} from "lucide-react";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debounced;
}

export default function BrowseProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "SALE" | "RENT">(
    (searchParams.get("type") as "all" | "SALE" | "RENT") || "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    (searchParams.get("sort") as "newest" | "price-low" | "price-high") || "newest"
  );

  const debouncedSearch = useDebouncedValue(search);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, typeFilter, sortBy, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, sortBy]);

  // Fetch products - get all products (no shopId filter)
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ["all-products", { search: debouncedSearch, type: typeFilter, page, limit }],
    queryFn: () =>
      productApi.getProducts({
        // No shopId - get all products
        search: debouncedSearch || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        page,
        limit,
      }),
    select: (res) => res.data,
  });

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || { total: 0, total_pages: 1, page: 1 };

  // Sort products client-side (since backend doesn't support sort)
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.variants?.[0]?.pricing?.price || 0;
    const priceB = b.variants?.[0]?.pricing?.price || 0;

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
      default:
        return 0; // Keep original order
    }
  });

  const skeletons = new Array(12).fill(0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="flex flex-col gap-6 py-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Khám phá Sản phẩm
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Tìm kiếm và khám phá hàng ngàn sản phẩm thời trang tuyệt vời
                </p>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <Card className="p-4 border-2 border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      typeFilter === "all"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                    )}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setTypeFilter("SALE")}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      typeFilter === "SALE"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300"
                    )}
                  >
                    Bán
                  </button>
                  <button
                    onClick={() => setTypeFilter("RENT")}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      typeFilter === "RENT"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300"
                    )}
                  >
                    Thuê
                  </button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-11 px-4 pr-10 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white appearance-none cursor-pointer font-medium"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-low">Giá: Thấp → Cao</option>
                    <option value="price-high">Giá: Cao → Thấp</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex gap-2 border-2 border-gray-200 rounded-xl p-1 bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "grid"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "list"
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(typeFilter !== "all" || search) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Bộ lọc:</span>
                  {search && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <span className="mr-1">"{search}"</span>
                      <button
                        onClick={() => setSearch("")}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {typeFilter !== "all" && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      {typeFilter === "SALE" ? "Bán" : "Thuê"}
                      <button
                        onClick={() => setTypeFilter("all")}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </Card>

            {/* Stats */}
            {!isLoading && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-900">{pagination.total}</span>
                  <span>sản phẩm</span>
                </div>
                {typeFilter !== "all" && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span>Đang lọc theo: {typeFilter === "SALE" ? "Bán" : "Thuê"}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error State */}
          {isError && !isLoading && (
            <Card className="p-12 text-center border-2 border-red-200 bg-red-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="font-semibold text-red-600 mb-2">
                Không thể tải danh sách sản phẩm
              </p>
              <p className="text-sm text-gray-600">Vui lòng thử lại sau</p>
            </Card>
          )}

          {/* Products Grid/List */}
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                : "flex flex-col gap-4",
              isLoading && "opacity-60"
            )}
          >
            {isLoading
              ? skeletons.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "animate-pulse",
                      viewMode === "grid"
                        ? "space-y-2"
                        : "flex gap-4 p-4 bg-white rounded-xl border border-gray-100"
                    )}
                  >
                    <div
                      className={cn(
                        "bg-gray-200 rounded-xl",
                        viewMode === "grid" ? "aspect-square" : "w-24 h-24"
                      )}
                    />
                    {viewMode === "list" && (
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    )}
                  </div>
                ))
              : sortedProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} variant={viewMode} />
                ))}
          </div>

          {/* Empty State */}
          {!isLoading && !isError && sortedProducts.length === 0 && (
            <Card className="p-12 text-center border-2 border-dashed border-gray-200 bg-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 mb-2">
                {search || typeFilter !== "all"
                  ? "Không tìm thấy sản phẩm nào"
                  : "Chưa có sản phẩm nào"}
              </p>
              <p className="text-sm text-gray-600">
                {search || typeFilter !== "all"
                  ? "Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc"
                  : "Hãy quay lại sau để xem các sản phẩm mới"}
              </p>
            </Card>
          )}

          {/* Pagination */}
          {!isLoading && sortedProducts.length > 0 && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Trước
              </button>
              <span className="text-sm font-medium text-gray-700">
                Trang {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={page >= pagination.total_pages}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

