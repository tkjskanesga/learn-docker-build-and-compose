import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username minimal 3 karakter.")
  .max(20, "Username maksimal 20 karakter.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username hanya boleh berisi huruf, angka, dan garis bawah.",
  )
  .transform((value) => value.toLowerCase());

export const signupSchema = z.object({
  username: usernameSchema,
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter.")
    .max(72, "Kata sandi maksimal 72 karakter."),
});

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username wajib diisi.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const postContentSchema = z
  .string()
  .trim()
  .min(1, "Tulisan tidak boleh kosong.")
  .max(280, "Satu kiriman maksimal 280 karakter.");

export const threadSchema = z.object({
  contents: z
    .array(postContentSchema)
    .min(1, "Tulis sesuatu dulu.")
    .max(10, "Satu utas maksimal 10 kiriman."),
  parentId: z.number().int().positive().nullable().optional(),
  redirectTo: z.string().optional(),
});

export const searchSchema = z
  .string()
  .trim()
  .min(1, "Kata kunci wajib diisi.")
  .max(100, "Kata kunci terlalu panjang.");

export function fieldErrors(error) {
  const flattened = z.flattenError(error);
  return flattened.fieldErrors;
}
