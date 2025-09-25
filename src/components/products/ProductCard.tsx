import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/models/Product";
import { memo } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const firstImg = product.images?.[0] || product.variants?.[0]?.imgs?.[0];
  const price = product.variants?.[0]?.pricings?.[0]?.price;
  return (
    <div className="group space-y-2 text-sm rounded-md hover:shadow-md transition bg-white/70 backdrop-blur border border-gray-100 p-2">
      <div className="aspect-[1/1] overflow-hidden rounded bg-gray-100 relative">
        {firstImg ? (
          <img
            src={firstImg}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute top-2 right-2 text-xs bg-white/80 rounded-full px-2 py-1 shadow hover:bg-white"
        >
          ❤
        </button>
        <span className="absolute left-2 top-2 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
          NEW
        </span>
      </div>
      <div className="font-semibold truncate" title={product.name}>
        {product.name || "Unnamed"}
      </div>
      <div className="text-[11px] text-gray-500">Brand · Cat</div>
      <div className="text-base font-bold">{formatCurrency(price || 0)}</div>
      <div>
        <button className="text-[11px] underline text-gray-600 hover:text-gray-800">
          Similar Items
        </button>
      </div>
    </div>
  );
});
