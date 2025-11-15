import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/apis/product.api";
import type { GetProductsParams } from "@/apis/product.api";

export const useProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    select: (response) => response.data,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Retry on failure
    retry: 2,
  });
};

export const useProductsByShop = (
  shopId: string, 
  options?: Omit<GetProductsParams, 'shopId'>
) => {
  return useProducts({ shopId, ...options });
};
