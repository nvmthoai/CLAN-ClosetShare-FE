import { fetcher } from "./fetcher";
import type { Post, CreatePostPayload, UpdatePostPayload } from "../models/Social";

export const postApi = {
  // GET /posts - Get all posts
  getPosts: (params?: { page?: number; limit?: number; author_id?: string }) =>
    fetcher.get<{ posts: Post[]; total: number }>("/posts", { params }),

  // GET /posts/{postId} - Get single post by ID
  getPost: (postId: string) =>
    fetcher.get<Post>(`/posts/${postId}`),

  // POST /posts - Create new post
  createPost: (payload: CreatePostPayload) =>
    fetcher.post<Post>("/posts", payload),

  // PUT /posts/{postId} - Update post
  updatePost: (postId: string, payload: UpdatePostPayload) =>
    fetcher.put<Post>(`/posts/${postId}`, payload),

  // DELETE /posts/{postId} - Delete post
  deletePost: (postId: string) =>
    fetcher.delete(`/posts/${postId}`),
};
