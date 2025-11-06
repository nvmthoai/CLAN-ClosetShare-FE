export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  // Optional fields for UI display
  user?: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  images?: string[];
  caption?: string;
  likes?: number;
  isLiked?: boolean;
  comments?: Comment[];
  createdAt?: string;
  location?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  text?: string; // Legacy field
  content?: string; // API field
  createdAt: string;
  likes: number;
}

export interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  image: string;
  isViewed: boolean;
  createdAt: string;
}
