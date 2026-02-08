import {useState, useCallback} from 'react';
import {Comment} from '../types';

export const useConversation = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);

      // Simulate loading comments
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockComments: Comment[] = [
        {
          id: '1',
          author: 'John Doe',
          text: 'Great article! Really helpful information about React Native 0.74.3.',
          timestamp: new Date(Date.now() - 3600000),
          likes: 12,
        },
        {
          id: '2',
          author: 'Jane Smith',
          text: 'Thanks for sharing this. The new architecture improvements are impressive.',
          timestamp: new Date(Date.now() - 7200000),
          likes: 8,
        },
        {
          id: '3',
          author: 'Mike Johnson',
          text: 'Has anyone tried this with Expo? Would love to hear experiences.',
          timestamp: new Date(Date.now() - 10800000),
          likes: 5,
        },
      ];

      setComments(mockComments);
    } catch (error) {
      console.error('[useConversation] Error loading comments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addComment = useCallback(
    (text: string, author: string = 'You') => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author,
        text,
        timestamp: new Date(),
        likes: 0,
      };

      setComments(prev => [newComment, ...prev]);
    },
    [],
  );

  const likeComment = useCallback((commentId: string) => {
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
