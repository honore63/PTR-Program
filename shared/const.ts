export const COOKIE_NAME = "ptrp_session";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = "Please login";
export const NOT_ADMIN_ERR_MSG = "Administrator access required";

export const OAUTH_STATE_COOKIE = "__Host-oauth_state";

export type OAuthState = { redirectUri: string; nonce?: string };

export const encodeOAuthState = (state: OAuthState): string =>
  btoa(JSON.stringify(state));

export const decodeOAuthState = (state: string): OAuthState => {
  let decoded: string;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }

  try {
    const parsed: unknown = JSON.parse(decoded);
    if (parsed && typeof parsed === "object" && "redirectUri" in parsed && typeof parsed.redirectUri === "string") {
      const nonce = "nonce" in parsed && typeof parsed.nonce === "string" ? parsed.nonce : undefined;
      return nonce ? { redirectUri: parsed.redirectUri, nonce } : { redirectUri: parsed.redirectUri };
    }
  } catch {
    return { redirectUri: decoded };
  }

  return { redirectUri: decoded };
};
