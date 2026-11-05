export {};

export interface PtrpConfig {
  apiBaseUrl?: string;
  appName?: string;
  version?: string;
}

declare global {
  interface Window {
    __PTRP_CONFIG__?: PtrpConfig;
    __MANUS_CONFIG__?: Record<string, any>;
  }
}
