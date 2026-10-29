"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { IconEye, IconEyeOff } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-md border bg-background px-3 text-[15px] text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/35";

export function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const [state, formAction, isPending] = useActionState(
    isSignup ? signupAction : loginAction,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameError = state?.fieldErrors?.username?.[0];
  const passwordError = state?.fieldErrors?.password?.[0];

  useEffect(() => {
    if (usernameError) {
      usernameRef.current?.focus();
    } else if (passwordError) {
      passwordRef.current?.focus();
    }
  }, [usernameError, passwordError]);

  return (
    <div>
      <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em]">
        {isSignup ? "Buat akunmu" : "Masuk ke Kicau"}
      </h1>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
        {isSignup
          ? "Cukup username dan kata sandi. Akun langsung bisa dipakai."
          : "Lanjutkan percakapan yang tertinggal."}
      </p>

      <form action={formAction} className="mt-7 space-y-4" noValidate>
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Username
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[15px] text-muted"
            >
              @
            </span>
            <input
              ref={usernameRef}
              id="username"
              name="username"
              type="text"
              required
              maxLength={20}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="namakamu"
              aria-invalid={usernameError ? "true" : undefined}
              aria-describedby={
                usernameError
                  ? "username-error"
                  : isSignup
                    ? "username-hint"
                    : undefined
              }
              className={`${inputClass} pl-8 ${
                usernameError ? "border-danger" : "border-line"
              }`}
            />
          </div>
          {usernameError ? (
            <p
              id="username-error"
              className="mt-1.5 text-[13px] text-danger"
              role="alert"
            >
              {usernameError}
            </p>
          ) : isSignup ? (
            <p id="username-hint" className="mt-1.5 text-[12.5px] text-muted">
              3–20 karakter. Huruf, angka, dan garis bawah.
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Kata sandi
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              maxLength={72}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder={isSignup ? "Minimal 8 karakter" : "Kata sandi"}
              aria-invalid={passwordError ? "true" : undefined}
              aria-describedby={
                passwordError
                  ? "password-error"
                  : isSignup
                    ? "password-hint"
                    : undefined
              }
              className={`${inputClass} pr-11 ${
                passwordError ? "border-danger" : "border-line"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-1 flex w-9 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {passwordError ? (
            <p
              id="password-error"
              className="mt-1.5 text-[13px] text-danger"
              role="alert"
            >
              {passwordError}
            </p>
          ) : isSignup ? (
            <p id="password-hint" className="mt-1.5 text-[12.5px] text-muted">
              Minimal 8 karakter.
            </p>
          ) : null}
        </div>

        {state?.error ? (
          <p
            role="alert"
            className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-[13.5px] text-danger"
          >
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 h-11 w-full rounded-full bg-accent text-[15px] font-bold text-white transition-colors hover:bg-accent-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Memproses…" : isSignup ? "Buat akun" : "Masuk"}
        </button>
      </form>

      {isSignup ? (
        <p className="mt-3 text-center text-[12.5px] leading-relaxed text-muted">
          Tidak perlu verifikasi email. Langsung masuk setelah akun dibuat.
        </p>
      ) : null}

      <p className="mt-7 text-[14px] text-muted">
        {isSignup ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-accent hover:underline"
        >
          {isSignup ? "Masuk" : "Daftar"}
        </Link>
      </p>
    </div>
  );
}
