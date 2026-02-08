export interface SSOStartResponse {
  codeA: string;
}

export interface UserLoginStatus {
  isGuest: boolean;
  userId?: string;
}

export interface OpenWebAuthService {
  startSSO: () => Promise<SSOStartResponse>;
  completeSSO: (codeB: string) => Promise<void>;
  getUserLoginStatus: () => Promise<UserLoginStatus>;
  logout: () => Promise<void>;
}
