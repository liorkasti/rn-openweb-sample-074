import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {PreConversationProps, PreviewComment} from '../types';

export const PreConversation = ({
  postId,
  articleTitle = 'Sample Article',
  commentCount = 0,
  previewComments = [],
  onTap,
}: PreConversationProps): React.JSX.Element => {
  const displayComments = previewComments.slice(0, 3);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onTap}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Join the Conversation</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.articleTitle}>{articleTitle}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{commentCount}</Text>
            <Text style={styles.statLabel}>
              {commentCount === 1 ? 'Comment' : 'Comments'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reactions</Text>
          </View>
        </View>

        {displayComments.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Recent Comments</Text>
            {displayComments.map(comment => (
              <View key={comment.id} style={styles.previewComment}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                </View>
                <Text style={styles.commentText} numberOfLines={2}>
                  {comment.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.ctaText}>Tap to view full conversation</Text>
        <Text style={styles.arrow}>→</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>OpenWeb</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ctaText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  previewSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewComment: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  commentTime: {
    fontSize: 11,
    color: '#999',
  },
  commentText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666',
  },
});
