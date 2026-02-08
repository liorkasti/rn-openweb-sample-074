import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type {OWSSOProvider} from 'react-native-openweb-sdk';
import {AuthStatus, INITIAL_AUTH_STATE} from '../features/auth/types';
import type {AuthState} from '../features/auth/types';
import {
  authService,
  exchangeCodeAForCodeB,
} from '../features/auth/services/OpenWebAuth';

// ── Public API ─────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  /** Run the full SSO handshake (startSSO → backend → completeSSO). */
  authenticate: () => Promise<boolean>;
  /** SSO via a third-party provider (Janrain, Gigya, Piano, Auth0…). */
  authenticateWithProvider: (
    provider: OWSSOProvider,
    token: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const authFlowCompletionRef = useRef<(() => void) | null>(null);

  // ── Helpers ──

  const completeAuthFlow = useCallback(() => {
    if (authFlowCompletionRef.current) {
      authFlowCompletionRef.current();
      authFlowCompletionRef.current = null;
    }
  }, []);

  const dismissAuthModal = useCallback(
    (show: boolean) => {
      setShowAuthModal(show);
      // When the modal is dismissed without successful auth,
      // still call the SDK completion so native side isn't stuck waiting.
      if (!show) {
        completeAuthFlow();
      }
    },
    [completeAuthFlow],
  );

  // ── Status ──

  const refreshStatus = useCallback(async () => {
    const authState = await authService.getUserStatus();
    setState(authState);
  }, []);

  // ── SSO Handshake ──

  const authenticate = useCallback(async (): Promise<boolean> => {
    setState(prev => ({...prev, isLoading: true, error: undefined}));
    try {
      const codeA = await authService.startSSO();
      const codeB = await exchangeCodeAForCodeB(codeA);
      const userId = await authService.completeSSO(codeB);

      setState({status: AuthStatus.Authenticated, userId, isLoading: false});
      completeAuthFlow();
      return true;
    } catch (error: any) {
      const message = error?.message || 'SSO authentication failed';
      console.error('[AuthContext]', message);
      setState(prev => ({...prev, isLoading: false, error: message}));
      return false;
    }
  }, [completeAuthFlow]);

  // ── Provider SSO ──

  const authenticateWithProvider = useCallback(
    async (provider: OWSSOProvider, token: string): Promise<boolean> => {
      setState(prev => ({...prev, isLoading: true, error: undefined}));
      try {
        const userId = await authService.ssoUsingProvider(provider, token);
        setState({status: AuthStatus.Authenticated, userId, isLoading: false});
        completeAuthFlow();
        return true;
      } catch (error: any) {
        const message = error?.message || 'Provider authentication failed';
        console.error('[AuthContext]', message);
        setState(prev => ({...prev, isLoading: false, error: message}));
        return false;
      }
    },
    [completeAuthFlow],
  );

  // ── Logout ──

  const logout = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true}));
    try {
      await authService.logout();
      setState({status: AuthStatus.Guest, isLoading: false});
    } catch (error: any) {
      console.error('[AuthContext] Logout error:', error?.message);
      setState(prev => ({...prev, isLoading: false}));
    }
  }, []);

  // ── SDK Event Handlers ──

  useEffect(() => {
    const unsubAuthFlow = authService.onDisplayAuthenticationFlow(
      completion => {
        authFlowCompletionRef.current = completion;
        setShowAuthModal(true);
      },
    );

    const unsubRenew = authService.onRenewSSO(async (_userId, completion) => {
      try {
        const codeA = await authService.startSSO();
        const codeB = await exchangeCodeAForCodeB(codeA);
        await authService.completeSSO(codeB);
      } catch (error) {
        console.error('[AuthContext] SSO renewal failed:', error);
      }
      completion();
    });

    authService.shouldDisplayLoginPrompt = true;
    refreshStatus();

    return () => {
      unsubAuthFlow();
      unsubRenew();
    };
  }, [refreshStatus]);

  // ── Value ──

  const value: AuthContextValue = {
    ...state,
    authenticate,
    authenticateWithProvider,
    logout,
    refreshStatus,
    showAuthModal,
    setShowAuthModal: dismissAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ───────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
