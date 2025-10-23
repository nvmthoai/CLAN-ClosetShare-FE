import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/social/PostCard";
import { Stories } from "@/components/social/Stories";
import Layout from "@/components/layout/Layout";
import type { Post, Story } from "@/models/Social";
import { useState } from "react";

// Mock data for development
const mockStories: Story[] = [
  {
    id: "1",
    user: {
      id: "1",
      username: "fashionista",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100",
    },
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    isViewed: false,
    createdAt: "2025-09-27T10:00:00Z",
  },
  {
    id: "2",
    user: {
      id: "2",
      username: "styleicon",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    },
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    isViewed: true,
    createdAt: "2025-09-27T09:30:00Z",
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "1",
      username: "fashionista",
      name: "Emma Style",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100",
    },
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600",
    ],
    caption:
      "New vintage find! 💫 This 90s blazer is everything. Can't wait to style it with my favorite jeans. #vintage #fashion #ootd",
    likes: 2847,
    isLiked: false,
    comments: [
      {
        id: "1",
        user: {
          id: "2",
          username: "styleicon",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
        },
        text: "This is gorgeous! Where did you find it? 😍",
        createdAt: "2025-09-27T11:30:00Z",
        likes: 12,
      },
      {
        id: "2",
        user: { id: "3", username: "vintagelover" },
        text: "90s blazers are the best! Perfect fit 🔥",
        createdAt: "2025-09-27T11:45:00Z",
        likes: 8,
      },
    ],
    createdAt: "2025-09-27T10:00:00Z",
    location: "Vintage Store, NYC",
  },
  {
    id: "2",
    user: {
      id: "2",
      username: "styleicon",
      name: "Maya Chen",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    },
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600",
    ],
    caption:
      "Sunset vibes in my favorite dress ✨ Sometimes the simplest outfits make the biggest statement.",
    likes: 1234,
    isLiked: true,
    comments: [
      {
        id: "3",
        user: {
          id: "1",
          username: "fashionista",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100",
        },
        text: "Absolutely stunning! 💖",
        createdAt: "2025-09-27T09:15:00Z",
        likes: 5,
      },
    ],
    createdAt: "2025-09-27T08:30:00Z",
  },
];

export default function Feed() {
  const queryClient = useQueryClient();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Use mock data for now, replace with actual API calls later
  const { data: stories = mockStories } = useQuery({
    queryKey: ["stories"],
    queryFn: () => Promise.resolve({ data: mockStories }),
    select: (res) => res.data,
  });

  const { data: posts = mockPosts, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => Promise.resolve({ data: mockPosts }),
    select: (res) => res.data,
  });

  const likeMutation = useMutation({
    mutationFn: (_postId: string) => {
      // Mock API call
      return Promise.resolve({ data: { success: true } });
    },
    onMutate: async (postId) => {
      // Optimistic update
      queryClient.setQueryData(["feed"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        );
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({
      postId: _postId,
      text,
    }: {
      postId: string;
      text: string;
    }) => {
      // Mock API call
      return Promise.resolve({
        data: {
          id: Date.now().toString(),
          user: { id: "me", username: "you" },
          text,
          createdAt: new Date().toISOString(),
          likes: 0,
        },
      });
    },
    onSuccess: (data, { postId }) => {
      queryClient.setQueryData(["feed"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, data.data] }
            : post
        );
      });
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleComment = (postId: string, text: string) => {
    commentMutation.mutate({ postId, text });
  };

  const handleViewStory = (storyId: string) => {
    // Mark story as viewed
    queryClient.setQueryData(["stories"], (oldStories: Story[] | undefined) => {
      if (!oldStories) return [];
      return oldStories.map((story) =>
        story.id === storyId ? { ...story, isViewed: true } : story
      );
    });
  };

  const categories = [
    "For you",
    "Trending",
    "Minimal",
    "Vintage",
    "Street",
    "Runway",
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white bg-brand-gradient shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">
                Welcome back
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Your Fashion Feed
              </h1>
              <p className="opacity-90 mt-1 text-sm">
                Curated looks and drops tailored for you
              </p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary font-medium hover:bg-white/90 shadow"
            >
              <span>＋</span>
              Create post
            </button>
          </div>
          {/* Decorative blobs */}
          <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* Stories (glass card) */}
        <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
          <Stories stories={stories} onViewStory={handleViewStory} />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((t) => (
            <button
              key={t}
              className="px-3 py-1.5 rounded-full border text-sm text-gray-700 hover:bg-primary/10 hover:text-primary"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main grid with suggestions */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-6 items-start">
          {/* Feed */}
          <div className="space-y-6 max-w-2xl">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}

            {/* Load more indicator */}
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading more posts...
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <aside className="hidden xl:block space-y-4 sticky top-24">
            <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
              <h2 className="text-sm font-semibold mb-3">Who to follow</h2>
              <div className="space-y-3">
                {["sophia", "kenny", "maria"].map((u) => (
                  <div key={u} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={`https://ui-avatars.com/api/?name=${u}`}
                        alt={u}
                      />
                      <div className="text-sm">
                        <div className="font-medium">{u}</div>
                        <div className="text-gray-500">New on ClosetShare</div>
                      </div>
                    </div>
                    <button className="text-sm px-2 py-1 rounded border hover:bg-primary/10 hover:text-primary">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
              <h2 className="text-sm font-semibold mb-3">Trending tags</h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {["#vintage", "#streetwear", "#y2k", "#minimal", "#summer"].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-full border text-gray-600 hover:bg-primary/10 hover:text-primary"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
              <h2 className="text-sm font-semibold mb-2">Weekly highlight</h2>
              <div className="p-3 rounded-lg border bg-gradient-to-br from-white to-gray-50">
                <div className="text-sm font-medium mb-1">AI stylist tip</div>
                <p className="text-xs text-gray-600">
                  Try pairing vintage blazers with modern sneakers for a fresh
                  silhouette.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Popup */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Tạo bài viết mới</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung bài viết
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Chia sẻ phong cách thời trang của bạn..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh (tối đa 10 ảnh)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedImages(prev => [...prev, ...files].slice(0, 10));
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-purple-600 text-xl">📷</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Nhấp để thêm hình ảnh
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </label>
                </div>
                
                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  placeholder="#vintage #fashion #style"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle post creation here
                  console.log("Creating post:", { postContent, selectedImages });
                  setShowCreatePost(false);
                  setPostContent("");
                  setSelectedImages([]);
                }}
                disabled={!postContent.trim() && selectedImages.length === 0}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
