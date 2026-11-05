import type { Express } from "express";
import fs from "node:fs";
import path from "node:path";

export function registerStorageProxy(app: Express) {
  const handler = (req: any, res: any) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key || key.includes("..")) {
      res.status(400).send("Invalid asset key");
      return;
    }

    const projectRoot = path.resolve(import.meta.dirname, "../..");
    const candidates = [
      path.join(projectRoot, "uploads", key),
      path.join(projectRoot, "client", "public", "storage", key),
      path.join(projectRoot, "client", "public", "manus-storage", key),
      path.join(projectRoot, "client", "public", key),
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        res.sendFile(cand);
        return;
      }
    }

    res.status(404).send("Media asset not found");
  };

  app.get("/storage/*", handler);
  app.get("/uploads/*", handler);
  app.get("/manus-storage/*", handler);
}
