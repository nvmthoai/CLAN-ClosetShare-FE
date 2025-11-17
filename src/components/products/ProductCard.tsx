import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/models/Product";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export const ProductCard = memo(function ProductCard({
  product,
  variant = "grid",
}: ProductCardProps) {
  const firstImg = product.variants?.[0]?.images?.[0];
  const price = product.variants?.[0]?.pricing?.price;
  const type = product.type;
  const stock = product.variants?.[0]?.stock || 0;

  if (variant === "list") {
    return (
      <Link
        to={`/products/${product.id}`}
        className="group flex gap-4 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
      >
        <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 relative">
          {firstImg ? (
            <img
              src={firstImg}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
          {type && (
            <Badge
              className={cn(
                "absolute top-2 left-2 text-xs",
                type === "SALE"
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              )}
            >
              {type === "SALE" ? "Bán" : "Thuê"}
            </Badge>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {product.name || "Unnamed"}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description || "Không có mô tả"}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(price || 0)}
              </span>
              {stock > 0 ? (
                <span className="text-xs text-green-600 mt-1">Còn {stock} sản phẩm</span>
              ) : (
                <span className="text-xs text-red-600 mt-1">Hết hàng</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to wishlist
              }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        {firstImg ? (
          <img
            src={firstImg}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        {type && (
          <Badge
            className={cn(
              "absolute top-3 left-3 text-xs font-semibold shadow-md",
              type === "SALE"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
            )}
          >
            {type === "SALE" ? "Bán" : "Thuê"}
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-500 text-gray-600 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Hết hàng
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.name || "Unnamed"}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {product.description || "Không có mô tả"}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(price || 0)}
          </span>
          {stock > 0 && (
            <span className="text-xs text-green-600 font-medium">Còn {stock}</span>
          )}
        </div>
      </div>
    </Link>
  );
});
