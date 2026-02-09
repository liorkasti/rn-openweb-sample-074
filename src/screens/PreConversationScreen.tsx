import React from 'react';
import {StyleSheet, View} from 'react-native';
import {OpenWebPreConversation} from 'react-native-openweb-sdk';
import type {OWConversationRoute} from 'react-native-openweb-sdk';
import type {PreConversationScreenProps} from '../navigation/types';

export const PreConversationScreen = ({
  navigation,
  route,
}: PreConversationScreenProps): React.JSX.Element => {
  const {postId} = route.params;

  return (
    <View style={styles.container}>
      <OpenWebPreConversation
        postId={postId}
        style={styles.preConversation}
        onOpenConversationFlow={(conversationRoute?: OWConversationRoute) =>
          navigation.navigate('Conversation', {
            postId,
            route: conversationRoute,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preConversation: {
    flex: 1,
  },
});
