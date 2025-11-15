import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { shopApi } from "@/apis/shop.api";
import type { Shop } from "@/models/Shop";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { ShopCard } from "@/components/shop/ShopCard";
import { Search, Store } from "lucide-react";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  
  return debounced;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(search);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    setSearchParams(params, { replace: true });
  }, [search, setSearchParams]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["shops", page, limit, debouncedSearch],
    queryFn: () => shopApi.getAll({ page, limit, search: debouncedSearch || undefined }),
    select: (res) => {
      // API returns: { data: [...] } format
      const responseData = res.data;
      
      // If response.data is an array directly
      if (Array.isArray(responseData)) {
        return { shops: responseData, total: responseData.length };
      }
      
      // If response.data has a 'data' key containing the array
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        return { 
          shops: responseData.data as Shop[], 
          total: responseData.data.length 
        };
      }
      
      // If response.data has a 'shops' key
      if (responseData && typeof responseData === 'object' && 'shops' in responseData) {
        return responseData as { shops: Shop[]; total?: number };
      }
      
      // Fallback
      return { shops: [], total: 0 };
    },
    refetchOnWindowFocus: false,
  });

  const shops = data?.shops || [];
  const total = data?.total || shops.length;

  const skeletons = new Array(8).fill(0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="flex flex-col gap-6 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Khám phá Shop
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Tìm kiếm và khám phá các shop thời trang tuyệt vời
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm shop..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">{total}</span>
                <span>shop được tìm thấy</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="text-center py-20 bg-red-50 rounded-2xl border-2 border-red-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="font-semibold text-red-600 mb-2">
                Không thể tải danh sách shop
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Vui lòng thử lại sau
              </p>
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Shops Grid */}
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
              isLoading && "opacity-60"
            )}
          >
            {isLoading
              ? skeletons.map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))
              : shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>

          {/* Empty State */}
          {!isLoading && !isError && shops.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 mb-2">
                {search ? "Không tìm thấy shop nào" : "Chưa có shop nào"}
              </p>
              <p className="text-sm text-gray-600">
                {search
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Hãy quay lại sau để xem các shop mới"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && shops.length > 0 && (
            <div className="flex justify-center items-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Trước
              </button>
              <span className="text-sm font-medium text-gray-700">
                Trang {page} / {Math.ceil(total / limit) || 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / limit)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
