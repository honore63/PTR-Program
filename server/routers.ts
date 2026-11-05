import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  content: router({
    get: publicProcedure.input(z.object({ slug: z.string().min(1).max(120) })).query(({ input }) => db.getPublishedSiteContent(input.slug)),
  }),

  admin: router({
    overview: adminProcedure.query(async () => {
      const [content, media, users] = await Promise.all([db.listSiteContent(), db.listMediaAssets(), db.listUsers()]);
      return { contentCount: content.length, publishedCount: content.filter((item) => item.status === "published").length, mediaCount: media.length, userCount: users.length, adminCount: users.filter((item) => item.role === "admin").length };
    }),
    content: router({
      list: adminProcedure.query(() => db.listSiteContent()),
      upsert: adminProcedure.input(z.object({ slug: z.string().min(1).max(120), title: z.string().min(1).max(255), summary: z.string().max(500).nullable().optional(), body: z.string().min(1), status: z.enum(["draft", "published"]) })).mutation(({ ctx, input }) => db.upsertSiteContent({ ...input, updatedBy: ctx.user.id, summary: input.summary ?? null })),
      remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteSiteContent(input.id)),
    }),
    media: router({
      list: adminProcedure.query(() => db.listMediaAssets()),
      upload: adminProcedure.input(z.object({ filename: z.string().min(1).max(255), mimeType: z.string().min(1).max(120), size: z.number().int().positive().max(10 * 1024 * 1024), base64: z.string().min(1).max(14_000_000), altText: z.string().max(255).nullable().optional() })).mutation(async ({ ctx, input }) => {
        const allowed = /^(image\/(png|jpe?g|webp|gif|svg\+xml)|video\/(mp4|webm)|application\/pdf|application\/vnd\.(ms-powerpoint|openxmlformats-officedocument\.presentationml\.presentation)|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/i;
        if (!allowed.test(input.mimeType)) throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported upload type" });
        const buffer = Buffer.from(input.base64, "base64");
        if (buffer.length !== input.size || buffer.length > 10 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload size validation failed" });
        const uploaded = await storagePut(`ptrp/admin/${input.filename}`, buffer, input.mimeType);
        return db.createMediaAsset({ filename: input.filename, storageKey: uploaded.key, url: uploaded.url, mimeType: input.mimeType, size: input.size, altText: input.altText ?? null, status: "approved", uploadedBy: ctx.user.id });
      }),
      update: adminProcedure.input(z.object({ id: z.number().int().positive(), altText: z.string().max(255).nullable().optional(), status: z.enum(["pending", "approved", "archived"]).optional() })).mutation(({ input }) => db.updateMediaAsset(input.id, { altText: input.altText, status: input.status })),
    }),
    users: router({
      list: adminProcedure.query(() => db.listUsers()),
      setRole: adminProcedure.input(z.object({ id: z.number().int().positive(), role: z.enum(["user", "admin"]) })).mutation(({ ctx, input }) => {
        if (!ENV.ownerOpenId || ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN", message: "Only the project owner can change administrator access." });
        if (input.id === ctx.user.id && input.role === "user") throw new TRPCError({ code: "BAD_REQUEST", message: "The project owner must retain administrator access." });
        return db.updateUserRole(input.id, input.role);
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
