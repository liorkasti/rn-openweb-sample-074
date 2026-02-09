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

// ── SSO API Configuration ───────────────────────────────────
// In production, this call should be made from your backend server.
// For this sample app, we call the OpenWeb API directly.

const SSO_API_BASE = 'https://www.spot.im/api/sso/v1/register-user';
const ACCESS_TOKEN = '03190715DchJcY';

export interface SSOUserCredentials {
  primaryKey: string;
  userName: string;
}

// Default test user credentials
export const DEFAULT_SSO_USER: SSOUserCredentials = {
  primaryKey: 'u_mfs01DpWfsXp',
  userName: 'Test-User',
};

// All available test users
export const SSO_TEST_USERS: Array<SSOUserCredentials & {label: string}> = [
  {label: 'Test-User', primaryKey: 'u_mfs01DpWfsXp', userName: 'Test-User'},
  {label: 'Liran Nahum', primaryKey: 'u_JVLw4Cl2FqJP', userName: 'liran_n'},
  {
    label: 'Mykhailo Nester',
    primaryKey: 'u_EhJJAQhiYuN1',
    userName: 'mykhailo_n',
  },
  {label: 'Guy Shoham', primaryKey: 'u_pPAWB9sIYt99', userName: 'guy_s'},
  {label: 'Refael Sommer', primaryKey: 'u_3EvxAJzjHxyV', userName: 'refael_s'},
  {label: 'Alon Shprung', primaryKey: 'u_DlHL06mEamDM', userName: 'alon_s'},
  {label: 'Anael Peguine', primaryKey: 'u_K2uWaOcfRZBX', userName: 'anael_p'},
  {label: 'Alon Haiut', primaryKey: 'u_gApBQQo4EwGh', userName: 'alon_h'},
  {label: 'Nogah Melamed', primaryKey: 'u_OFwv7yQfeakS', userName: 'nogah_m'},
];

/**
 * Exchange codeA for codeB via the OpenWeb SSO registration API.
 * @see https://developers.openweb.com/docs/single-sign-on
 *
 * API: GET https://www.spot.im/api/sso/v1/register-user
 *   ?code_a=<codeA>&access_token=<token>&primary_key=<userId>&user_name=<name>
 *
 * Returns codeB as raw text.
 */
export const exchangeCodeAForCodeB = async (
  codeA: string,
  user: SSOUserCredentials = DEFAULT_SSO_USER,
): Promise<string> => {
  const url =
    `${SSO_API_BASE}?code_a=${encodeURIComponent(codeA)}` +
    `&access_token=${encodeURIComponent(ACCESS_TOKEN)}` +
    `&primary_key=${encodeURIComponent(user.primaryKey)}` +
    `&user_name=${encodeURIComponent(user.userName)}`;

  console.log(TAG, '[SSO API] Exchanging codeA for user:', user.userName);

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(TAG, '[SSO API] Error:', response.status, errorBody);
    throw new Error(`SSO API error ${response.status}: ${errorBody}`);
  }

  // API returns codeB as raw text
  const codeB = await response.text();
  console.log(TAG, '[SSO API] Got codeB:', codeB.substring(0, 20) + '…');
  return codeB;
};
