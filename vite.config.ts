import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { publicPlatformScript } from "./server/_core/publicConfig";

const PROJECT_ROOT = import.meta.dirname;

// Platform configuration script serving in development
function vitePluginPublicPlatformConfig(): Plugin {
  return {
    name: "ptrp-public-platform-config",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestPath = new URL(req.url ?? "/", "http://localhost").pathname;
        if (!requestPath.endsWith("/api/platform/config.js")) return next();
        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        res.end(publicPlatformScript());
      });
    },
  };
}

function vitePluginXamppAssetPaths(): Plugin {
  return {
    name: "xampp-asset-paths",
    enforce: "pre",
    transform(code) {
      if (process.env.VERCEL === "1") return null;
      if (!code.includes("/storage/") && !code.includes("/manus-storage/") && !code.includes('window.location.href = "/"') && !code.includes('<a href="/" className="admin-back-link"')) return null;
      return code
        .replaceAll("/storage/", "/PTRP/storage/")
        .replaceAll("/manus-storage/", "/PTRP/storage/")
        .replaceAll('window.location.href = "/"', "window.location.href = import.meta.env.BASE_URL")
        .replaceAll('<a href="/" className="admin-back-link"', '<a href={import.meta.env.BASE_URL} className="admin-back-link"');
    },
  };
}

function vitePluginSpaRouteEntries(): Plugin {
  const routes = ["about", "portal", "admin", "network", "impact", "news", "gallery", "alumni", "resources", "partners", "contact", "activities", "practices", "404"];
  return {
    name: "spa-route-entry-files",
    writeBundle(options) {
      const outputDirectory = options.dir ?? path.resolve(PROJECT_ROOT, "PTRP");
      const entryPath = path.join(outputDirectory, "index.html");
      if (!fs.existsSync(entryPath)) return;
      const entry = fs.readFileSync(entryPath, "utf8");
      // Route entry files are served directly on static hosts, so give each one
      // its own title for crawlers and social previews before the SPA boots.
      const routeTitles: Record<string, string> = {};
      try {
        const manifestCandidates = [
          path.resolve(PROJECT_ROOT, "client", "public", "routes.json"),
          path.resolve(PROJECT_ROOT, "client", "public", "manus-routes.json"),
        ];
        for (const cand of manifestCandidates) {
          if (fs.existsSync(cand)) {
            const manifest = JSON.parse(fs.readFileSync(cand, "utf8")) as { routes?: Array<{ path: string; title: string }> };
            for (const item of manifest.routes ?? []) routeTitles[item.path.replace(/^\//, "")] = item.title;
            break;
          }
        }
      } catch {
        /* titles fall back to the entry document */
      }
      const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      const withTitle = (html: string, title?: string) => {
        if (!title) return html;
        const safe = escapeHtml(title);
        return html
          .replace(/<title>[^<]*<\/title>/, `<title>${safe}</title>`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${safe}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${safe}$2`);
      };
      for (const route of routes) {
        const routeDirectory = path.join(outputDirectory, route);
        fs.mkdirSync(routeDirectory, { recursive: true });
        fs.writeFileSync(path.join(routeDirectory, "index.html"), withTitle(entry, routeTitles[route]), "utf8");
      }
    },
  };
}

const plugins = [
  vitePluginXamppAssetPaths(),
  vitePluginPublicPlatformConfig(),
  vitePluginSpaRouteEntries(),
  react(),
  tailwindcss(),
  jsxLocPlugin(),
];

export default defineConfig({
  base: process.env.VERCEL === "1" ? "/" : "/PTRP/",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return;
          if (id.includes("/node_modules/@radix-ui/")) return "vendor-radix";
          if (id.includes("/node_modules/lucide-react/")) return "vendor-icons";
          if (id.includes("/node_modules/framer-motion/")) return "vendor-motion";
          if (id.includes("/node_modules/react-dom/") || id.includes("/node_modules/react/")) return "vendor-react";
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
