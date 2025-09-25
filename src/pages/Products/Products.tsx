/* eslint-disable */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi, type GetProductsParams } from "@/apis/product.api";
import type { Product } from "@/models/Product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [sizes, setSizes] = useState<string[]>([]);
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
  sizes: sizes.length ? sizes.join(",") : undefined,
  priceMin: priceMin ?? undefined,
  priceMax: priceMax ?? undefined,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    select: (res) => res.data as { data?: Product[]; total?: number },
    refetchOnWindowFocus: false,
  });

  const items = data?.data || [];

  const showFiltersBar =
    sizes.length > 0 || priceMin != null || priceMax != null || search;

  const clearAll = () => {
    setSizes([]);
    setPriceMin(null);
    setPriceMax(null);
    setSearch("");
  };

  const skeletons = new Array(8).fill(0);

  return (
    <Layout
      sidebar={
        <SidebarFilters
          sizes={sizes}
          onChangeSizes={setSizes}
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl font-bold">Shop</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Discover curated fashion pieces from our community
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search for anything"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
            <Button onClick={() => refetch()} variant="secondary">
              Search
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 border rounded-md px-2 text-sm bg-white"
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
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                Search: {search}
              </span>
            )}
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSizes((prev) => prev.filter((v) => v !== s))}
                className="group px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[11px] font-medium flex items-center gap-1"
              >
                {s}
                <span className="text-gray-400 group-hover:text-gray-600">
                  ✕
                </span>
              </button>
            ))}
            {(priceMin != null || priceMax != null) && (
              <span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-medium">
                {priceMin ?? 0} - {priceMax ?? "∞"}
              </span>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] underline text-gray-500 hover:text-gray-700 ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center text-red-600 py-20 bg-red-50 rounded">
            Failed to load products
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
                  <div className="aspect-[1/1] rounded bg-gray-200" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))
            : items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {!isLoading && !isError && items.length === 0 && (
          <div className="text-center py-20 text-sm text-gray-500">
            No products match your filters.
          </div>
        )}
        <div className="flex justify-center items-center gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Prev
          </Button>
          <span className="text-sm">Page {page}</span>
          <Button onClick={() => setPage((p) => p + 1)} disabled={isLoading}>
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
