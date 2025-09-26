import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import type { User } from "@/models/User";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [viewType, setViewType] = useState("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) => res.data as User,
  });

  // Mock data for recently viewed and virtual closet
  const recentlyViewed = Array(5).fill(null);
  const virtualClosetItems = Array(6).fill(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Failed to load profile</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  const userName = data?.name || "Shop/Business";
  const userAvatar = data?.avatarUrl;

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Header with avatar and greeting */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-semibold border-4 border-white shadow-lg">
                {userName.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Hello, {userName}!
          </h1>
          <p className="text-sm text-gray-600">{data?.email}</p>
        </div>

        {/* Recently viewed section */}
        <div className="px-6 py-6 border-b">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Recently viewed</h2>
          <div className="flex gap-3">
            {recentlyViewed.map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-300 cursor-pointer transition"
              >
                <div className="w-6 h-6 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Virtual Closet section */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">My Virtual Closet</h2>
            <div className="relative">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="appearance-none bg-transparent text-sm text-gray-600 pr-6 focus:outline-none cursor-pointer hover:text-gray-800"
              >
                <option value="all">View</option>
                <option value="favorites">Favorites</option>
                <option value="recent">Recent</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Virtual closet grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {virtualClosetItems.map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-200 transition relative overflow-hidden"
              >
                {/* Placeholder clothing items */}
                <div className="text-2xl text-gray-400 group-hover:text-gray-500 transition">
                  {i % 3 === 0 ? "👗" : i % 3 === 1 ? "👚" : "👖"}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
              </div>
            ))}
          </div>

          {/* Add item button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
          >
            <span className="text-lg mr-2">+</span>
            Add new item
          </Button>
        </div>
      </div>
    </Layout>
  );
}
