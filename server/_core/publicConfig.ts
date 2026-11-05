// Only public values may reach the browser. Never serialize secrets.
export function publicPlatformConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    appName: "PTR Alumni Network",
    apiBaseUrl: env.VITE_API_BASE_URL ?? "/PTRP/api/",
    version: "1.0.0",
  };
}

export function publicPlatformScript(env: NodeJS.ProcessEnv = process.env): string {
  const json = JSON.stringify(publicPlatformConfig(env)).replaceAll("<", "\\u003c");
  return `window.__PTRP_CONFIG__=${json}; window.__MANUS_CONFIG__=window.__PTRP_CONFIG__;`;
}
