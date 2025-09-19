export type AppEnv = {
  API_BASE_URL: string;
  WS_URL: string;
};

/**
 * PUBLIC_INTERFACE
 * getEnv retrieves environment variables for the frontend.
 * It first checks for injected globals (window.__APP_ENV__), then falls back to defaults.
 * To configure in deployment, ensure .env maps to variables injected at runtime, or serve
 * a small /env.js that sets window.__APP_ENV__.
 */
export function getEnv(): AppEnv {
  const injected = (globalThis as any).__APP_ENV__ || {};
  return {
    API_BASE_URL: injected.API_BASE_URL || (typeof process !== 'undefined' && (process as any).env?.NG_APP_API_BASE_URL) || '/api',
    WS_URL: injected.WS_URL || (typeof process !== 'undefined' && (process as any).env?.NG_APP_WS_URL) || 'ws://localhost:4000/ws',
  };
}
