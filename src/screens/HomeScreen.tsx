import React, {useState, useCallback} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {OpenWeb} from 'react-native-openweb-sdk';
import {Colors} from '../theme/colors';
import {DEFAULT_SPOT_ID, DEFAULT_POST_ID} from '../config/constants';
import {AuthModal} from '../components/AuthModal';
import {SettingsPanel} from '../components/SettingsPanel';
import {useAuth} from '../context/AuthContext';
import {AuthStatus} from '../features/auth/types';
import type {HomeScreenProps} from '../navigation/types';

export const HomeScreen = ({
  navigation,
  route,
}: HomeScreenProps): React.JSX.Element => {
  const [spotId, setSpotId] = useState(DEFAULT_SPOT_ID);
  const [postId, setPostId] = useState(DEFAULT_POST_ID);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Open settings when triggered from stack navigator header button
  React.useEffect(() => {
    if (route.params?._openSettings) {
      setSettingsVisible(true);
    }
  }, [route.params?._openSettings]);

  const [sdkReady, setSdkReady] = useState(false);
  const [initError, setInitError] = useState<string | undefined>();

  const {status, userId, isLoading, setShowAuthModal, logout} = useAuth();
  const isAuthenticated = status === AuthStatus.Authenticated;

  // Initialize SDK with spotId
  React.useEffect(() => {
    if (spotId) {
      setSdkReady(false);
      setInitError(undefined);
      try {
        OpenWeb.manager.setSpotId(spotId);
        setSdkReady(true);
      } catch (e: any) {
        setInitError(e?.message || 'Failed to initialize SDK');
      }
    }
  }, [spotId]);

  const handleNavigateToPreConversation = useCallback(() => {
    if (!sdkReady || !postId) {
      return;
    }
    navigation.navigate('PreConversation', {spotId, postId});
  }, [navigation, sdkReady, spotId, postId]);

  const handleNavigateToConversation = useCallback(() => {
    if (!sdkReady || !postId) {
      return;
    }
    navigation.navigate('Conversation', {postId});
  }, [navigation, sdkReady, postId]);

  const handleAuthPress = useCallback(() => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, logout, setShowAuthModal]);

  const getInitial = (): string => {
    if (userId) {
      return userId.charAt(0).toUpperCase();
    }
    return '?';
  };

  const canNavigate = sdkReady && !!postId;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome</Text>
          <Text style={styles.heroSubtitle}>
            OpenWeb SDK Sample{' \u00B7 '}React Native 0.74.3
          </Text>
        </View>

        {/* Section: Configuration */}
        <Text style={styles.sectionTitle}>Configuration</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusBadge,
                sdkReady ? styles.badgeReady : styles.badgePending,
              ]}>
              <View
                style={[
                  styles.statusDot,
                  sdkReady ? styles.dotReady : styles.dotPending,
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  sdkReady ? styles.badgeTextReady : styles.badgeTextPending,
                ]}>
                {sdkReady ? 'Ready' : 'Not Ready'}
              </Text>
            </View>
          </View>

          {initError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{initError}</Text>
            </View>
          )}

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Spot ID</Text>
            <Text style={styles.configValue} numberOfLines={1}>
              {spotId}
            </Text>
          </View>
          <View style={[styles.configRow, styles.configRowLast]}>
            <Text style={styles.configLabel}>Post ID</Text>
            <Text style={styles.configValue}>{postId}</Text>
          </View>
        </View>

        {/* Section: Authentication */}
        <Text style={styles.sectionTitle}>Authentication</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={handleAuthPress}
          disabled={isLoading}
          activeOpacity={0.7}>
          <View style={styles.authRow}>
            <View style={styles.authLeft}>
              <View
                style={[
                  styles.authAvatar,
                  isAuthenticated
                    ? styles.authAvatarActive
                    : styles.authAvatarGuest,
                ]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : isAuthenticated ? (
                  <Text style={styles.authAvatarText}>{getInitial()}</Text>
                ) : (
                  <Text style={styles.authAvatarIcon}>&#128100;</Text>
                )}
              </View>
              <View style={styles.authInfo}>
                <Text style={styles.authName}>
                  {isAuthenticated ? userId || 'User' : 'Guest'}
                </Text>
                <Text style={styles.authStatus}>
                  {isAuthenticated ? 'Tap to logout' : 'Tap to sign in'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.authChevron,
                isAuthenticated && styles.authChevronActive,
              ]}>
              <Text style={styles.authChevronText}>
                {isAuthenticated ? '\u2715' : '\u203A'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Section: Navigation */}
        <Text style={styles.sectionTitle}>Conversations</Text>

        <TouchableOpacity
          style={[styles.navCard, !canNavigate && styles.navCardDisabled]}
          onPress={handleNavigateToPreConversation}
          disabled={!canNavigate}
          activeOpacity={0.8}>
          <View style={styles.navCardContent}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>&#128172;</Text>
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navCardTitle}>Pre-Conversation</Text>
              <Text style={styles.navCardDescription}>
                Preview comments and open the full thread
              </Text>
            </View>
          </View>
          <Text style={styles.navArrow}>&#8250;</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navCard,
            styles.navCardAlt,
            !canNavigate && styles.navCardDisabled,
          ]}
          onPress={handleNavigateToConversation}
          disabled={!canNavigate}
          activeOpacity={0.8}>
          <View style={styles.navCardContent}>
            <View style={[styles.navIconContainer, styles.navIconContainerAlt]}>
              <Text style={styles.navIcon}>&#128488;</Text>
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.navCardTitle}>Full Conversation</Text>
              <Text style={styles.navCardDescription}>
                Jump directly into the complete discussion
              </Text>
            </View>
          </View>
          <Text style={styles.navArrow}>&#8250;</Text>
        </TouchableOpacity>

        {!canNavigate && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Configure a valid Spot ID and Post ID to get started
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Auth Modal */}
      <AuthModal />

      {/* Settings Panel */}
      <SettingsPanel
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        spotId={spotId}
        postId={postId}
        onSpotIdChange={setSpotId}
        onPostIdChange={setPostId}
      />
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

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },

  // Sections
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 20,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 14,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeReady: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  badgePending: {
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextReady: {
    color: Colors.success,
  },
  badgeTextPending: {
    color: Colors.warning,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotReady: {
    backgroundColor: Colors.success,
  },
  dotPending: {
    backgroundColor: Colors.warning,
  },
  errorBanner: {
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  configRowLast: {
    borderBottomWidth: 0,
  },
  configLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  configValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: '60%',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Auth
  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authAvatarActive: {
    backgroundColor: Colors.success,
  },
  authAvatarGuest: {
    backgroundColor: Colors.textMuted,
  },
  authAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  authAvatarIcon: {
    fontSize: 20,
  },
  authInfo: {
    flex: 1,
  },
  authName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  authStatus: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  authChevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authChevronActive: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  authChevronText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '300',
  },

  // Navigation Cards
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...CARD_SHADOW,
  },
  navCardAlt: {
    borderLeftColor: Colors.primaryDark,
  },
  navCardDisabled: {
    opacity: 0.4,
  },
  navCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  navIconContainerAlt: {
    backgroundColor: 'rgba(53, 122, 189, 0.1)',
  },
  navIcon: {
    fontSize: 22,
  },
  navTextContainer: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  navCardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
  navArrow: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: '300',
    marginLeft: 8,
  },

  // Hint
  hintContainer: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  hintText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bottomSpacer: {
    height: 40,
  },
});
