import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/social/PostCard";
import Layout from "@/components/layout/Layout";
import type { Post, CreatePostPayload, UpdatePostPayload } from "@/models/Social";
import { postApi } from "@/apis/post.api";
import { useState } from "react";



export default function Feed() {
  const queryClient = useQueryClient();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  // Stories removed from feed (per design request)

  // Fetch posts from API
  const { data: posts, isLoading, isError: postsError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(),
    select: (res) => {
      // Handle both array response and object with posts property
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return res.data?.posts || [];
    },
  });

  // Debug: Log API data
  console.log("Posts API Response:", posts);
  console.log("Loading:", isLoading);
  console.log("Error:", postsError);

  const likeMutation = useMutation({
    mutationFn: (_postId: string) => {
      // Mock API call
      return Promise.resolve({ data: { success: true } });
    },
    onMutate: async (postId) => {
      // Optimistic update
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post: Post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
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
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post: Post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), data.data] }
            : post
        );
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.createPost(payload),
    onSuccess: (data) => {
      // Add the new post to the feed
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        const newPost = data.data;
        if (newPost) {
          return [newPost, ...oldPosts];
        }
        return oldPosts;
      });
      // Reset form
      setPostTitle("");
      setPostContent("");
      setShowCreatePost(false);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  const editPostMutation = useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: UpdatePostPayload }) => 
      postApi.updatePost(postId, payload),
    onSuccess: (data, { postId }) => {
      // Update the post in the cache
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post: Post) =>
          post.id === postId ? { ...post, ...data.data } : post
        );
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleComment = (postId: string, text: string) => {
    commentMutation.mutate({ postId, text });
  };

  const handleEdit = (postId: string, payload: UpdatePostPayload) => {
    editPostMutation.mutate({ postId, payload });
  };

  // Stories removed — no story handling needed

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

        {/* Stories removed */}

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
            {isLoading ? (
              <div className="space-y-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white border rounded-lg animate-pulse">
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="w-full h-64 bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : postsError ? (
              <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Lỗi tải bài viết
                </h3>
                <p className="text-red-600 mb-4">
                  Không thể tải bài viết từ server. Vui lòng thử lại sau.
                </p>
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["posts"] })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            ) : (posts?.length || 0) === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Hãy tạo bài viết đầu tiên để chia sẻ phong cách của bạn!
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Tạo bài viết
                </button>
              </div>
            ) : (
              (posts || []).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onEdit={handleEdit}
                />
              ))
            )}

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

            {/* Trending tags removed */}

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
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

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
                  if (postTitle.trim() && postContent.trim()) {
                    createPostMutation.mutate({
                      title: postTitle.trim(),
                      content: postContent.trim(),
                    });
                  }
                }}
                disabled={!postTitle.trim() || !postContent.trim() || createPostMutation.isPending}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPostMutation.isPending ? "Đang đăng..." : "Đăng bài"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
