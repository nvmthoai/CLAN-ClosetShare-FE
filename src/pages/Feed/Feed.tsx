import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialApi } from "@/apis/social.api";
import { PostCard } from "@/components/social/PostCard";
import { Stories } from "@/components/social/Stories";
import { InstagramNav } from "@/components/social/InstagramNav";
import type { Post, Story } from "@/models/Social";

// Mock data for development
const mockStories: Story[] = [
  {
    id: "1",
    user: { id: "1", username: "fashionista", avatar: "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100" },
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    isViewed: false,
    createdAt: "2025-09-27T10:00:00Z",
  },
  {
    id: "2", 
    user: { id: "2", username: "styleicon", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" },
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
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100",
    },
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600",
    ],
    caption: "New vintage find! 💫 This 90s blazer is everything. Can't wait to style it with my favorite jeans. #vintage #fashion #ootd",
    likes: 2847,
    isLiked: false,
    comments: [
      {
        id: "1",
        user: { id: "2", username: "styleicon", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" },
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
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    },
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600"],
    caption: "Sunset vibes in my favorite dress ✨ Sometimes the simplest outfits make the biggest statement.",
    likes: 1234,
    isLiked: true,
    comments: [
      {
        id: "3",
        user: { id: "1", username: "fashionista", avatar: "https://images.unsplash.com/photo-1494790108755-2616b35d4e36?w=100" },
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
    mutationFn: (postId: string) => {
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
    mutationFn: ({ postId, text }: { postId: string; text: string }) => {
      // Mock API call
      return Promise.resolve({ 
        data: { 
          id: Date.now().toString(),
          user: { id: "me", username: "you" },
          text,
          createdAt: new Date().toISOString(),
          likes: 0,
        }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InstagramNav />
        <main className="pt-4 pb-20 md:pb-4 px-4">
          <div className="max-w-md mx-auto space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramNav />
      
      <main className="pt-4 pb-20 md:pb-4 px-4">
        <div className="max-w-md mx-auto">
          {/* Stories */}
          <Stories stories={stories} onViewStory={handleViewStory} />
          
          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
          
          {/* Load more indicator */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              Loading more posts...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}