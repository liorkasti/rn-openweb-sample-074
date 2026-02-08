import {useState, useCallback} from 'react';
import {OpenWebAuth, exchangeCodeAForCodeB} from '../services/OpenWebAuth';
import {UserLoginStatus} from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userStatus, setUserStatus] = useState<UserLoginStatus>({
    isGuest: true,
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      const status = await OpenWebAuth.getUserLoginStatus();
      setUserStatus(status);
      setIsAuthenticated(!status.isGuest);
      return status;
    } catch (error) {
      console.error('[useAuth] Error checking auth status:', error);
      throw error;
    }
  }, []);

  const authenticate = useCallback(async () => {
    try {
      setIsAuthenticating(true);

      // Step 1: Start SSO - get codeA
      const {codeA} = await OpenWebAuth.startSSO();

      // Step 2: Exchange codeA for codeB (backend call)
      const codeB = await exchangeCodeAForCodeB(codeA);

      // Step 3: Complete SSO with codeB
      await OpenWebAuth.completeSSO(codeB);

      // Update status
      await checkAuthStatus();

      return true;
    } catch (error) {
      console.error('[useAuth] Authentication error:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [checkAuthStatus]);

  const logout = useCallback(async () => {
    try {
      await OpenWebAuth.logout();
      await checkAuthStatus();
    } catch (error) {
      console.error('[useAuth] Logout error:', error);
      throw error;
    }
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    isAuthenticating,
    userStatus,
    authenticate,
    logout,
    checkAuthStatus,
  };
};
