import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Shop } from "@/models/Shop";
import { Star, MapPin, Phone, Mail, Store } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const renderStars = (rating: number = 0) => {
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
    <Link to={`/view-shop/${shop.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1 cursor-pointer">
        {/* Shop Avatar/Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 overflow-hidden">
          {shop.background ? (
            <img
              src={shop.background}
              alt={shop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Avatar overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-end gap-3">
              {shop.avatar ? (
                <img
                  src={shop.avatar}
                  alt={shop.name}
                  className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <Store className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1 pb-2">
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-2">
                  {renderStars(shop.rating || 0)}
                  <span className="text-xs text-white/90">
                    {shop.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={
                shop.status === "ACTIVE"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : shop.status === "UNVERIFIED"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }
            >
              {shop.status === "ACTIVE"
                ? "Hoạt động"
                : shop.status === "UNVERIFIED"
                ? "Chờ xác minh"
                : "Tạm dừng"}
            </Badge>
          </div>
        </div>

        {/* Shop Info */}
        <div className="p-5 space-y-3">
          {/* Description */}
          {shop.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {shop.description}
            </p>
          )}

          {/* Contact Info */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {shop.address && (
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{shop.address}</span>
              </div>
            )}
            {shop.phone_number && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{shop.phone_number}</span>
              </div>
            )}
            {shop.email && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="line-clamp-1">{shop.email}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {shop.products_count !== undefined && (
              <span>{shop.products_count} sản phẩm</span>
            )}
            {shop.reviews_count !== undefined && (
              <span>{shop.reviews_count} đánh giá</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

