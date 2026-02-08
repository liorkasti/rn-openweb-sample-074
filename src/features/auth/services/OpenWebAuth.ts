import {Platform} from 'react-native';
import {SSOStartResponse, UserLoginStatus, OpenWebAuthService} from '../types';

class OpenWebAuthServiceImpl implements OpenWebAuthService {
  private currentUser: UserLoginStatus = {isGuest: true};

  startSSO = async (): Promise<SSOStartResponse> => {
    // Simulate SSO start - generates codeA
    // In real implementation, this would call native OpenWeb SDK
    console.log('[OpenWebAuth] Starting SSO flow...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const codeA = `codeA_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    console.log('[OpenWebAuth] Generated codeA:', codeA);

    return {codeA};
  };

  completeSSO = async (codeB: string): Promise<void> => {
    // Simulate SSO completion with codeB from backend
    console.log('[OpenWebAuth] Completing SSO with codeB:', codeB);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful authentication
    this.currentUser = {
      isGuest: false,
      userId: `user_${Date.now()}`,
    };

    console.log(
      '[OpenWebAuth] SSO completed. User ID:',
      this.currentUser.userId,
    );
  };

  getUserLoginStatus = async (): Promise<UserLoginStatus> => {
    console.log('[OpenWebAuth] Getting user login status...');
    return this.currentUser;
  };

  logout = async (): Promise<void> => {
    console.log('[OpenWebAuth] Logging out user...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    this.currentUser = {isGuest: true};
    console.log('[OpenWebAuth] User logged out');
  };
}

// Singleton instance
export const OpenWebAuth = new OpenWebAuthServiceImpl();

// Mock backend exchange function (in real app, this would be a backend API call)
export const exchangeCodeAForCodeB = async (codeA: string): Promise<string> => {
  console.log('[MockBackend] Exchanging codeA for codeB:', codeA);

  // Simulate backend API call
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock codeB generation
  const codeB = `codeB_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;
  console.log('[MockBackend] Generated codeB:', codeB);

  return codeB;
};
