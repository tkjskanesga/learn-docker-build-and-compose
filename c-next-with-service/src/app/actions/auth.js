"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { users } from "@/database/schema";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { fieldErrors, loginSchema, signupSchema } from "@/lib/validation";

export async function signupAction(_previousState, formData) {
  const parsed = signupSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const { username, password } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing) {
    return {
      fieldErrors: { username: ["Username ini sudah dipakai."] },
    };
  }

  const passwordHash = await hashPassword(password);
  let createdUser;

  try {
    [createdUser] = await db
      .insert(users)
      .values({
        username,
        displayName: username,
        passwordHash,
      })
      .returning({ id: users.id });
  } catch (error) {
    if (error?.code === "23505") {
      return {
        fieldErrors: { username: ["Username ini sudah dipakai."] },
      };
    }
    throw error;
  }

  await createSession(createdUser.id);
  redirect("/");
}

export async function loginAction(_previousState, formData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const { username, password } = parsed.data;

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const isValid = user
    ? await verifyPassword(password, user.passwordHash)
    : false;

  if (!isValid) {
    return { error: "Username atau kata sandi tidak cocok." };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
