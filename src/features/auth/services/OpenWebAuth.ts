import {OpenWeb} from 'react-native-openweb-sdk';
import type {OWSSOProvider} from 'react-native-openweb-sdk';
import {AuthStatus} from '../types';
import type {AuthState} from '../types';

const TAG = '[AuthService]';

/**
 * Authentication service wrapping the OpenWeb SDK authentication API.
 * @see https://developers.openweb.com/docs/authentication
 */
class AuthService {
  private get auth() {
    return OpenWeb.manager.authentication;
  }

  // ── SSO Handshake Flow ──────────────────────────────────

  async startSSO(): Promise<string> {
    console.log(TAG, 'Starting SSO → generating codeA…');
    const codeA = await this.auth.startSSO();
    console.log(TAG, 'codeA:', codeA);
    return codeA;
  }

  async completeSSO(codeB: string): Promise<string> {
    console.log(TAG, 'Completing SSO with codeB…');
    const userId = await this.auth.completeSSO(codeB);
    console.log(TAG, 'SSO done. userId:', userId);
    return userId;
  }

  // ── Third-Party Provider SSO ────────────────────────────

  async ssoUsingProvider(
    provider: OWSSOProvider,
    token: string,
  ): Promise<string> {
    console.log(TAG, 'SSO via provider:', provider.type);
    const userId = await this.auth.ssoUsingProvider(provider, token);
    console.log(TAG, 'Provider SSO done. userId:', userId);
    return userId;
  }

  // ── Status & Logout ─────────────────────────────────────

  async getUserStatus(): Promise<AuthState> {
    try {
      const status = await this.auth.getUserStatus();
      switch (status.type) {
        case 'ssoLoggedIn':
          return {
            status: AuthStatus.Authenticated,
            userId: status.userId,
            isLoading: false,
          };
        case 'guest':
          return {status: AuthStatus.Guest, isLoading: false};
        default:
          return {status: AuthStatus.Unknown, isLoading: false};
      }
    } catch (error: any) {
      console.warn(TAG, 'getUserStatus error:', error?.message);
      return {status: AuthStatus.Unknown, isLoading: false};
    }
  }

  async logout(): Promise<void> {
    console.log(TAG, 'Logging out…');
    await this.auth.logout();
    console.log(TAG, 'Logged out');
  }

  // ── Event Handlers ──────────────────────────────────────

  onRenewSSO(handler: (userId: string, completion: () => void) => void) {
    return this.auth.onRenewSSO(handler);
  }

  onDisplayAuthenticationFlow(handler: (completion: () => void) => void) {
    return this.auth.onDisplayAuthenticationFlow(handler);
  }

  // ── Login Prompt Control ────────────────────────────────

  set shouldDisplayLoginPrompt(value: boolean) {
    this.auth.shouldDisplayLoginPrompt = value;
  }

  get shouldDisplayLoginPrompt(): boolean {
    return this.auth.shouldDisplayLoginPrompt;
  }
}

export const authService = new AuthService();

/**
 * Mock backend exchange: codeA → codeB.
 *
 * ⚠️  In production replace this with a real backend call:
 *   GET /sso/v1/register-user
 *     ?access_token=YOUR_SECRET
 *     &code_a=<codeA>
 *     &primary_key=<userId>
 *     &user_name=<displayName>
 *
 * The mock generates a fake codeB which the SDK will reject.
 * Use a real backend or the "SSO with Provider" option for
 * end-to-end testing.
 */
export const exchangeCodeAForCodeB = async (codeA: string): Promise<string> => {
  console.log(TAG, '[MockBackend] Exchanging codeA:', codeA);
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600));
  const codeB = `mock_codeB_${Date.now()}`;
  console.log(TAG, '[MockBackend] codeB:', codeB);
  return codeB;
};
