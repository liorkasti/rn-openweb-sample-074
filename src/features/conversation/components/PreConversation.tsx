import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PreConversationProps} from '../types';
import {OpenWebConversation} from '../services/OpenWebConversation';

export const PreConversation = ({
  postId,
  articleTitle = 'Sample Article',
  onTap,
}: PreConversationProps): React.JSX.Element => {
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      setIsLoading(true);
      try {
        const data = await OpenWebConversation.getPreConversationData(postId);
        setCommentCount(data.commentCount);
      } catch (error) {
        console.error('[PreConversation] Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

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
});
