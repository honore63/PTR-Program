import { afterEach, describe, expect, it, vi } from "vitest";
import { publicPlatformConfig, publicPlatformScript } from "./_core/publicConfig";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { COOKIE_NAME } from "../shared/const";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("current platform integration", () => {
  it("exposes only named public runtime configuration", () => {
    const env = {
      APP_ID: "ptrp-test",
      SESSION_SECRET: "unit-test-session-secret-with-at-least-32-characters",
      DATABASE_URL: "db-only-test",
    };
    const config = publicPlatformConfig(env);
    expect(config).toHaveProperty("appName");
    expect(config).toHaveProperty("version");
    // Must not expose secrets
    const script = publicPlatformScript(env);
    for (const value of [env.SESSION_SECRET, env.DATABASE_URL]) {
      expect(script).not.toContain(value);
    }
    // Script must not append extra DOM elements
    const appended: unknown[] = [];
    const fakeDocument = {
      createElement: () => ({ setAttribute() {} }),
      head: { appendChild: (node: unknown) => appended.push(node) },
    };
    new Function("window", "document", script)({}, fakeDocument);
    expect(appended).toHaveLength(0);
    new Function("window", "document", publicPlatformScript({}))({}, fakeDocument);
    expect(appended).toHaveLength(0);
  });

  it("uses a distinct secure app cookie behind the HTTPS Preview proxy", () => {
    expect(COOKIE_NAME).not.toBe("app_session_id");
    expect(COOKIE_NAME).toBe("ptrp_session");
    expect(getSessionCookieOptions({ protocol: "http", headers: {} } as never)).toMatchObject({
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  });

  it("binds signed app sessions and verifies them correctly", async () => {
    vi.stubEnv("SESSION_SECRET", "unit-test-session-secret-with-at-least-32-characters");
    vi.stubEnv("APP_ID", "ptrp-test");
    const token = await sdk.signSession({ openId: "user-test", appId: "ptrp-test", name: "" });
    const result = await sdk.verifySession(token);
    expect(result).toMatchObject({ openId: "user-test" });
  });

  it("rejects sessions signed with a different secret", async () => {
    vi.stubEnv("SESSION_SECRET", "unit-test-session-secret-A-with-at-least-32-characters");
    vi.stubEnv("APP_ID", "ptrp-test");
    const token = await sdk.signSession({ openId: "user-test", appId: "ptrp-test", name: "" });
    vi.stubEnv("SESSION_SECRET", "unit-test-session-secret-B-with-at-least-32-characters");
    expect(await sdk.verifySession(token)).toBeNull();
  });

  it("refuses to sign sessions without a strong configured secret", async () => {
    vi.stubEnv("SESSION_SECRET", "");
    vi.stubEnv("JWT_SECRET", "");
    await expect(sdk.signSession({ openId: "user-test", appId: "ptrp-test", name: "" }))
      .rejects.toThrow("at least 32 characters");
  });
});
