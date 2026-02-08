import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {ConversationProps} from '../types';
import {useAuth} from '../../../context/AuthContext';
import {AuthStatus} from '../../auth/types';
import {useConversation} from '../hooks/useConversation';

export const Conversation = ({
  postId,
  articleTitle = 'Article Title',
  articleUrl,
  onClose,
}: ConversationProps): React.JSX.Element => {
  const {
    status,
    isLoading: isAuthenticating,
    authenticate,
    refreshStatus,
  } = useAuth();
  const isAuthenticated = status === AuthStatus.Authenticated;
  const {comments, isLoading, loadComments, addComment, likeComment} =
    useConversation(postId);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      await refreshStatus();
      await loadComments();
    } catch (error) {
      console.error('[Conversation] Initialization error:', error);
      Alert.alert('Error', 'Failed to load conversation');
    }
  };

  const handleAuthenticate = async () => {
    try {
      await authenticate();
      Alert.alert('Success', 'You are now authenticated!');
    } catch (error) {
      console.error('[Conversation] Authentication error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to post comments',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Sign In', onPress: handleAuthenticate},
        ],
      );
      return;
    }

    addComment(newComment);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to like comments');
      return;
    }

    likeComment(commentId);
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Conversation</Text>
          <Text style={styles.headerSubtitle}>{articleTitle}</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.authBar}>
        {isAuthenticated ? (
          <Text style={styles.authStatus}>✓ Signed In</Text>
        ) : (
          <TouchableOpacity
            onPress={handleAuthenticate}
            disabled={isAuthenticating}
            style={styles.signInButton}>
            {isAuthenticating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In to Comment</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.commentsContainer}>
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>{comments.length} Comments</Text>
        </View>

        {comments.map(comment => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentTime}>
                {formatTimestamp(comment.timestamp)}
              </Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => handleLikeComment(comment.id)}
                style={styles.likeButton}>
                <Text style={styles.likeIcon}>👍</Text>
                <Text style={styles.likeCount}>{comment.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={
            isAuthenticated
              ? 'Write a comment...'
              : 'Sign in to join the conversation'
          }
          value={newComment}
          onChangeText={setNewComment}
          multiline
          editable={isAuthenticated}
        />
        <TouchableOpacity
          onPress={handlePostComment}
          disabled={!isAuthenticated || !newComment.trim()}
          style={[
            styles.postButton,
            (!isAuthenticated || !newComment.trim()) &&
              styles.postButtonDisabled,
          ]}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A90E2',
    borderBottomWidth: 1,
    borderBottomColor: '#3A7BC8',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F4FF',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  authBar: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  authStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsContainer: {
    flex: 1,
  },
  statsBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  commentCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#CCC',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
