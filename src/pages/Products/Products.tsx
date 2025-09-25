/* eslint-disable */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi, type GetProductsParams } from "@/apis/product.api";
import type { Product } from "@/models/Product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SidebarFilters from "@/components/layout/SidebarFilters";

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
  const debouncedSearch = useDebouncedValue(search);

  const params: GetProductsParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    select: (res) => res.data as { data?: Product[]; total?: number },
    refetchOnWindowFocus: false,
  });

  const items = data?.data || [];

  return (
    <Layout sidebar={<SidebarFilters />}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <h1 className="text-2xl font-bold flex-1">Shop</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search for anything"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
            <Button onClick={() => refetch()} variant="secondary">
              Search
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-20">Loading products…</div>
        ) : isError ? (
          <div className="text-center text-red-600 py-20">
            Failed to load products
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-10">
            {items.map((p) => {
              const firstImg = p.images?.[0] || p.variants?.[0]?.imgs?.[0];
              const price = p.variants?.[0]?.pricings?.[0]?.price;
              return (
                <div key={p.id} className="space-y-2 text-sm">
                  <div className="aspect-[1/1] overflow-hidden rounded bg-gray-100">
                    {firstImg ? (
                      <img
                        src={firstImg}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="font-semibold truncate">
                    {p.name || "ABC"}
                  </div>
                  <div className="text-[11px] text-gray-500">ABC X ABC</div>
                  <div className="text-base font-bold">
                    {price ? `$${price}` : "$560"}
                  </div>
                  <div>
                    <button className="text-[11px] underline text-gray-600">
                      Similar Items
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex justify-center items-center gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm">Page {page}</span>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </Layout>
  );
}
