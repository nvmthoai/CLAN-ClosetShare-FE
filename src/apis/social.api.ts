import { fetcher } from "./fetcher";

export const socialApi = {
  // Posts
  getFeed: (page = 1, limit = 10) =>
    fetcher.get("/posts/feed", { params: { page, limit } }),

  likePost: (postId: string) => fetcher.post(`/posts/${postId}/like`),

  unlikePost: (postId: string) => fetcher.delete(`/posts/${postId}/like`),

  addComment: (postId: string, text: string) =>
    fetcher.post(`/posts/${postId}/comments`, { text }),

  // Stories
  getStories: () => fetcher.get("/stories"),

  markStoryViewed: (storyId: string) =>
    fetcher.post(`/stories/${storyId}/view`),

  // User actions
  followUser: (userId: string) => fetcher.post(`/users/${userId}/follow`),

  unfollowUser: (userId: string) => fetcher.delete(`/users/${userId}/follow`),
};
