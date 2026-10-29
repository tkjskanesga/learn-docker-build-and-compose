"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { likes, posts } from "@/database/schema";
import { getSessionUser } from "@/lib/auth";
import { threadSchema } from "@/lib/validation";

function safeRedirectTarget(value) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }
  return null;
}

export async function createThread(input) {
  const user = await getSessionUser();

  if (!user) {
    return { error: "Sesi kamu sudah berakhir. Silakan masuk lagi." };
  }

  const parsed = threadSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Kiriman tidak valid." };
  }

  const contents = parsed.data.contents
    .map((content) => content.trim())
    .filter(Boolean);
  const parentId = parsed.data.parentId ?? null;

  if (contents.length === 0) {
    return { error: "Tulis sesuatu dulu." };
  }

  if (parentId) {
    const [parent] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, parentId))
      .limit(1);

    if (!parent) {
      return { error: "Kiriman yang ingin dibalas tidak ditemukan." };
    }
  }

  let firstId = null;
  let previousId = parentId;

  await db.transaction(async (tx) => {
    for (const content of contents) {
      const [created] = await tx
        .insert(posts)
        .values({ authorId: user.id, parentId: previousId, content })
        .returning({ id: posts.id });

      if (!firstId) {
        firstId = created.id;
      }
      previousId = created.id;
    }
  });

  revalidatePath("/", "layout");

  const target = safeRedirectTarget(parsed.data.redirectTo);
  redirect(target ?? `/p/${firstId}`);
}

export async function toggleLike(postId) {
  const user = await getSessionUser();

  if (!user) {
    return { error: "Sesi kamu sudah berakhir. Silakan masuk lagi." };
  }

  const id = Number(postId);

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Kiriman tidak valid." };
  }

  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  if (!post) {
    return { error: "Kiriman tidak ditemukan." };
  }

  const [existing] = await db
    .select({ postId: likes.postId })
    .from(likes)
    .where(and(eq(likes.postId, id), eq(likes.userId, user.id)))
    .limit(1);

  if (existing) {
    await db
      .delete(likes)
      .where(and(eq(likes.postId, id), eq(likes.userId, user.id)));
  } else {
    await db
      .insert(likes)
      .values({ postId: id, userId: user.id })
      .onConflictDoNothing();
  }

  revalidatePath("/", "layout");
  return { liked: !existing };
}
