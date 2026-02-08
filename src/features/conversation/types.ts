export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface ConversationProps {
  postId: string;
  articleTitle?: string;
  articleUrl?: string;
  onClose?: () => void;
}

export interface PreConversationProps {
  postId: string;
  articleTitle?: string;
  onTap?: () => void;
}
