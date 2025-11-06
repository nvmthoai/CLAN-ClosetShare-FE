/* eslint-disable */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi, type GetProductsParams } from "@/apis/product.api";
import type { Product } from "@/models/Product";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import SidebarFilters from "@/components/layout/SidebarFilters";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function Products() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  // dynamic filter by API: selected filter prop ids
  const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
  const [selectedMeta, setSelectedMeta] = useState<
    Array<{ id: string; name: string; filterName: string }>
  >([]);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const debouncedSearch = useDebouncedValue(search);

  const params: GetProductsParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    // Example additional params mapping, adapt to backend later:
    sort,
    priceMin: priceMin ?? undefined,
    priceMax: priceMax ?? undefined,
    // snake_case fallbacks
    price_min: priceMin ?? undefined,
    price_max: priceMax ?? undefined,
    // send both camelCase and snake_case so whichever backend expects works
    filterPropIds: selectedPropIds.length
      ? selectedPropIds.join(",")
      : undefined,
      // Removed invalid property 'filter_prop_ids' per type 'GetProductsParams'
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    select: (res) => res.data as { data?: Product[]; total?: number },
    refetchOnWindowFocus: false,
  });

  const items = data?.data || [];

  const showFiltersBar =
    selectedPropIds.length > 0 ||
    priceMin != null ||
    priceMax != null ||
    search;

  const clearAll = () => {
    setSelectedPropIds([]);
    setSelectedMeta([]);
    setPriceMin(null);
    setPriceMax(null);
    setSearch("");
  };

  const skeletons = new Array(8).fill(0);

  return (
    <Layout
      sidebar={
        <SidebarFilters
          selectedPropIds={selectedPropIds}
          onChangeSelectedProps={(ids, meta) => {
            setSelectedPropIds(ids);
            setSelectedMeta(meta);
          }}
          priceMin={priceMin}
          priceMax={priceMax}
          onChangePrice={(min, max) => {
            setPriceMin(min);
            setPriceMax(max);
          }}
          onClearAll={clearAll}
        />
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex flex-col flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shop</h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover curated fashion pieces from our community
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search for anything"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-medium"
              >
                Search
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 border-2 border-gray-200 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>
          </div>

          {showFiltersBar && (
            <div className="flex flex-wrap gap-2 items-center">
              {search && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200">
                  Search: {search}
                </span>
              )}
              {selectedMeta.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedPropIds((prev) =>
                      prev.filter((id) => id !== m.id)
                    );
                    setSelectedMeta((prev) => prev.filter((p) => p.id !== m.id));
                  }}
                  className="group px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-[11px] font-semibold flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all"
                  title={`${m.filterName}: ${m.name}`}
                >
                  {m.filterName}: {m.name}
                  <span className="text-gray-400 group-hover:text-blue-500">
                    ✕
                  </span>
                </button>
              ))}
              {(priceMin != null || priceMax != null) && (
                <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-700">
                  {priceMin ?? 0} - {priceMax ?? "∞"}
                </span>
              )}
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] underline text-gray-500 hover:text-blue-500 ml-1 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {isError && !isLoading && (
            <div className="text-center text-red-600 py-20 bg-red-50 rounded-2xl border-2 border-red-200">
              <p className="font-semibold">Failed to load products</p>
            </div>
          )}
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10",
              isLoading && "opacity-60"
            )}
          >
            {isLoading
              ? skeletons.map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="aspect-[1/1] rounded-2xl bg-gray-200" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                ))
              : items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {!isLoading && !isError && items.length === 0 && (
            <div className="text-center py-20 text-sm text-gray-600 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="font-medium">No products match your filters.</p>
            </div>
          )}
          <div className="flex justify-center items-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-5 py-2.5 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-gray-700">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
