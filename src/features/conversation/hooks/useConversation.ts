import {useState, useCallback} from 'react';
import {Comment} from '../types';
import {OpenWebConversation} from '../services/OpenWebConversation';

export const useConversation = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = useCallback(async () => {
    if (!postId) {
      console.log('[useConversation] No postId provided');
      return;
    }

    try {
      setIsLoading(true);
      const data = await OpenWebConversation.loadComments(postId);
      setComments(data.comments);
    } catch (error) {
      console.error('[useConversation] Error loading comments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(
    async (text: string) => {
      if (!postId) return;

      const newComment = await OpenWebConversation.postComment(postId, text);
      setComments(prev => [newComment, ...prev]);
    },
    [postId],
  );

  const likeComment = useCallback(async (commentId: string) => {
    await OpenWebConversation.likeComment(commentId);
    setComments(prev =>
      prev.map(c => (c.id === commentId ? {...c, likes: c.likes + 1} : c)),
    );
  }, []);

  return {
    comments,
    isLoading,
    loadComments,
    addComment,
    likeComment,
  };
};
