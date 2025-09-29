export interface Post {
  id: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  images: string[];
  caption: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
  location?: string;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  text: string;
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
