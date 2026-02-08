import React, {useCallback, useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import {OpenWebConversation} from 'react-native-openweb-sdk';
import {Colors} from '../theme/colors';
import type {ConversationScreenProps} from '../navigation/types';

export const ConversationScreen = ({
  navigation,
  route,
}: ConversationScreenProps): React.JSX.Element => {
  const {postId, route: conversationRoute} = route.params;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissed = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topAccent} />
      {ready ? (
        <OpenWebConversation
          postId={postId}
          route={conversationRoute}
          style={styles.conversation}
          onConversationDismissed={handleDismissed}
          onError={error => console.warn('[Conversation] error:', error)}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topAccent: {
    height: 3,
    backgroundColor: Colors.primary,
  },
  conversation: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
