import { useState } from "react";
import { InstagramNav } from "@/components/social/InstagramNav";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches] = useState([
    { id: "1", username: "fashionista", name: "Emma Style", avatar: "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100" },
    { id: "2", username: "styleicon", name: "Maya Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" },
  ]);

  const exploreGrid = [
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300", 
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300",
    "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=300",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=300",
    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300",
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Mock search results
    if (query.trim()) {
      setSearchResults([
        { id: "1", username: "fashionista", name: "Emma Style", avatar: "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100" },
        { id: "2", username: "styleicon", name: "Maya Chen", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramNav />
      
      <main className="pt-4 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="flex items-center bg-white border rounded-lg px-4 py-3">
              <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="ml-2 p-1"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {searchQuery ? (
            /* Search Results */
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-sm text-gray-600">Users</h2>
              </div>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.name}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="bg-white border rounded-lg mb-6">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-sm text-gray-600">Recent</h2>
                    <button className="text-sm text-blue-500 hover:text-blue-700">
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.name}</div>
                      </div>
                      <button className="p-1">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Explore Grid */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Explore</h2>
                <div className="grid grid-cols-3 gap-1">
                  {exploreGrid.map((src, i) => (
                    <div key={i} className="aspect-square relative cursor-pointer group">
                      <img
                        src={src}
                        alt={`Explore ${i + 1}`}
                        className="w-full h-full object-cover group-hover:opacity-90 transition"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}