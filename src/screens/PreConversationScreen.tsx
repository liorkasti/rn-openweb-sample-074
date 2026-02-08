import React, {useCallback, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import {OpenWebPreConversation} from 'react-native-openweb-sdk';
import type {OWConversationRoute} from 'react-native-openweb-sdk';
import {Colors} from '../theme/colors';
import type {PreConversationScreenProps} from '../navigation/types';
import {ErrorBoundary} from '../components/ErrorBoundary';

export const PreConversationScreen = ({
  navigation,
  route,
}: PreConversationScreenProps): React.JSX.Element => {
  const {postId, spotId} = route.params;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    // Wait for all interactions to complete before mounting the native view
    // This ensures the React Native bridge is fully initialized
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      // Add an additional delay to ensure native modules are registered
      timeoutId = setTimeout(() => {
        setReady(true);
      }, 800);
    });

    return () => {
      interactionHandle.cancel();
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleOpenConversation = useCallback(
    (conversationRoute?: OWConversationRoute) => {
      navigation.navigate('Conversation', {postId, route: conversationRoute});
    },
    [navigation, postId],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        {/* Post Info Bar */}
        <View style={styles.infoBanner}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Post</Text>
            <Text style={styles.infoValue}>{postId}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Spot</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {spotId}
            </Text>
          </View>
        </View>

        {/* Pre-Conversation Widget */}
        <View style={styles.widgetCard}>
          {ready ? (
            <ErrorBoundary
              onReset={() => setReady(false)}
              fallback={
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorTitle}>Failed to load</Text>
                  <Text style={styles.errorMessage}>
                    The native component couldn't initialize properly.
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      setReady(false);
                      // Retry after a longer delay
                      setTimeout(() => setReady(true), 1500);
                    }}
                    activeOpacity={0.8}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              }>
              <OpenWebPreConversation
                postId={postId}
                style={styles.preConversation}
                onOpenConversationFlow={handleOpenConversation}
                onError={error =>
                  console.warn('[PreConversation] error:', error)
                }
              />
            </ErrorBoundary>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading comments...</Text>
            </View>
          )}
        </View>

        {/* View Full Conversation CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => handleOpenConversation()}
          activeOpacity={0.85}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaIcon}>&#128488;</Text>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>View Full Conversation</Text>
              <Text style={styles.ctaSubtitle}>
                See all comments and join the discussion
              </Text>
            </View>
          </View>
          <Text style={styles.ctaArrow}>&#8250;</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    ...CARD_SHADOW,
  },
  infoRow: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },

  // Widget Card
  widgetCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.background,
    borderRadius: 14,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  preConversation: {
    minHeight: 200,
  },
  loadingContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  // CTA Button
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    ...CARD_SHADOW,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ctaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  ctaArrow: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '300',
    marginLeft: 8,
  },

  bottomSpacer: {
    height: 32,
  },
});
