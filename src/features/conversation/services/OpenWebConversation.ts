import {Comment} from '../types';

export interface ConversationData {
  comments: Comment[];
  totalCount: number;
}

export interface PreConversationData {
  commentCount: number;
}

// Demo data for testing with sp_eCIlROSD / sdk1
// Reference: https://developers.openweb.com/docs/android-conversation
const DEMO_COMMENTS: Record<string, Comment[]> = {
  sdk1: [
    {
      id: 'c1',
      author: 'Sarah Chen',
      text: 'This is a great example of OpenWeb integration! The SDK makes it so easy to add conversations to any app.',
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      likes: 24,
    },
    {
      id: 'c2',
      author: 'Mike Johnson',
      text: 'I love how the Pre-Conversation view gives users a preview before diving into the full discussion.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      likes: 18,
    },
    {
      id: 'c3',
      author: 'Emily Davis',
      text: 'The moderation features are impressive. Keeps the conversation civil and on-topic.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      likes: 12,
    },
    {
      id: 'c4',
      author: 'Alex Thompson',
      text: 'Has anyone tried the SSO integration? Would love to hear about the experience.',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      likes: 8,
    },
    {
      id: 'c5',
      author: 'Jordan Lee',
      text: 'The real-time updates are seamless. Comments appear instantly without refreshing.',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      likes: 15,
    },
  ],
};

class OpenWebConversationService {
  private spotId: string | null = null;

  setSpotId(spotId: string) {
    this.spotId = spotId;
    console.log('[OpenWebConversation] SpotId set:', spotId);
  }

  async loadComments(postId: string): Promise<ConversationData> {
    console.log(
      '[OpenWebConversation] Loading comments for postId:',
      postId,
      'spotId:',
      this.spotId,
    );

    // Validate spotId is set
    if (!this.spotId) {
      console.warn(
        '[OpenWebConversation] SpotId not set, cannot load comments',
      );
      return {comments: [], totalCount: 0};
    }

    // Simulate network delay (like real SDK would have)
    await new Promise(resolve => setTimeout(resolve, 500));

    // TODO: Replace with actual OpenWeb SDK call
    // SpotIm.getConversation(postId, ...)

    // Return demo data for known postIds
    const comments = DEMO_COMMENTS[postId] || [];
    return {
      comments,
      totalCount: comments.length,
    };
  }

  async getPreConversationData(postId: string): Promise<PreConversationData> {
    console.log(
      '[OpenWebConversation] Getting pre-conversation for postId:',
      postId,
      'spotId:',
      this.spotId,
    );

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // TODO: Replace with actual OpenWeb SDK call
    // SpotIm.getPreConversation(postId, ...)

    // Return demo count for known postIds
    const comments = DEMO_COMMENTS[postId] || [];
    return {
      commentCount: comments.length,
    };
  }

  async postComment(postId: string, content: string): Promise<Comment> {
    console.log('[OpenWebConversation] Posting comment to postId:', postId);

    // TODO: Replace with actual OpenWeb SDK call

    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      text: content,
      timestamp: new Date(),
      likes: 0,
    };

    return newComment;
  }

  async likeComment(commentId: string): Promise<void> {
    console.log('[OpenWebConversation] Liking comment:', commentId);

    // TODO: Replace with actual OpenWeb SDK call
  }
}

export const OpenWebConversation = new OpenWebConversationService();
