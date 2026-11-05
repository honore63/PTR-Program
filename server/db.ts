import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertMediaAsset, InsertSiteContent, InsertUser, mediaAssets, siteContent, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listSiteContent() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(siteContent).orderBy(desc(siteContent.updatedAt));
}

export async function getPublishedSiteContent(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(siteContent).where(eq(siteContent.slug, slug)).limit(1);
  const row = rows[0];
  return row?.status === "published" ? row : null;
}

export async function upsertSiteContent(input: InsertSiteContent) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(siteContent).values(input).onDuplicateKeyUpdate({
    set: { title: input.title, summary: input.summary ?? null, body: input.body, status: input.status ?? "draft", updatedBy: input.updatedBy },
  });
  const rows = await db.select().from(siteContent).where(eq(siteContent.slug, input.slug)).limit(1);
  return rows[0];
}

export async function deleteSiteContent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(siteContent).where(eq(siteContent.id, id));
  return { success: true } as const;
}

export async function listMediaAssets() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function createMediaAsset(input: InsertMediaAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(mediaAssets).values(input);
  const rows = await db.select().from(mediaAssets).where(eq(mediaAssets.storageKey, input.storageKey)).limit(1);
  return rows[0];
}

export async function updateMediaAsset(id: number, input: Partial<Pick<InsertMediaAsset, "altText" | "status">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(mediaAssets).set(input).where(eq(mediaAssets.id, id));
  const rows = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  return rows[0];
}

export async function listUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn));
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ role }).where(eq(users.id, id));
  return { success: true } as const;
}
