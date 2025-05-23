export interface MultiActionAreaCardProps {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface LikeStateProps {
    likes: Record<string, boolean>;
}