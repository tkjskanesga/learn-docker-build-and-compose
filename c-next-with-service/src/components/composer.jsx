"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createThread } from "@/app/actions/posts";
import { Avatar } from "@/components/avatar";
import { IconClose, IconPlus } from "@/components/icons";

const LIMIT = 280;
const MAX_POSTS = 10;

export function Composer({
  user,
  parentId = null,
  redirectTo = "/",
  placeholder = "Apa yang sedang terjadi?",
  autoFocus = false,
  variant = "feed",
}) {
  const [items, setItems] = useState([{ key: 0, text: "" }]);
  const nextKey = useRef(1);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const firstTextarea = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      firstTextarea.current?.focus();
    }
  }, [autoFocus]);

  const hasContent = items.some((item) => item.text.trim().length > 0);
  const isOverLimit = items.some((item) => item.text.length > LIMIT);
  const canSubmit = hasContent && !isOverLimit && !isPending;

  function updateItem(key, text) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, text } : item)),
    );
    if (error) setError(null);
  }

  function addItem() {
    if (items.length >= MAX_POSTS) return;
    const key = nextKey.current;
    nextKey.current += 1;
    setItems((current) => [...current, { key, text: "" }]);
  }

  function removeItem(key) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  function submit() {
    if (!canSubmit) return;
    const contents = items.map((item) => item.text.trim()).filter(Boolean);
    setError(null);

    startTransition(async () => {
      const result = await createThread({ contents, parentId, redirectTo });
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div
      className={
        variant === "page" ? "px-4 py-3" : "border-b border-line px-4 py-3"
      }
    >
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Avatar user={user} size="md" />
          {items.length > 1 ? (
            <span
              aria-hidden="true"
              className="mt-2 w-0.5 flex-1 rounded-full bg-line"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          {items.map((item, index) => (
            <div
              key={item.key}
              className={index > 0 ? "border-t border-line pb-3 pt-3" : ""}
            >
              <label htmlFor={`post-${item.key}`} className="sr-only">
                {index === 0 ? placeholder : `Kiriman utas ke-${index + 1}`}
              </label>
              <textarea
                id={`post-${item.key}`}
                ref={index === 0 ? firstTextarea : undefined}
                value={item.text}
                onChange={(event) => updateItem(item.key, event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={index === 0 ? placeholder : "Lanjutkan utas…"}
                rows={1}
                className="min-h-9 w-full resize-none overflow-hidden bg-transparent text-[19px] leading-6 placeholder:text-muted focus:outline-none"
              />
              <div className="flex min-h-5 items-center justify-between">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[13px] font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <IconClose className="size-3.5" />
                    Hapus
                  </button>
                ) : (
                  <span />
                )}
                {item.text.length > 230 ? (
                  <span
                    className={`text-[12px] tabular-nums ${
                      item.text.length > LIMIT
                        ? "font-bold text-danger"
                        : "text-muted"
                    }`}
                  >
                    {LIMIT - item.text.length}
                  </span>
                ) : null}
              </div>
            </div>
          ))}

          {items.length > 1 ? (
            <p className="mb-2 text-[13px] font-medium text-accent">
              Utas · {items.length} kiriman
            </p>
          ) : null}

          <div className="mt-1 flex items-center justify-between gap-2 border-t border-line pt-3">
            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= MAX_POSTS}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13.5px] font-bold text-accent transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconPlus className="size-4" />
              Tambah kiriman
            </button>

            <div className="flex items-center gap-2">
              {items.length >= MAX_POSTS ? (
                <span className="hidden text-[12px] text-muted sm:block">
                  Maksimal {MAX_POSTS} kiriman
                </span>
              ) : null}
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="h-9 rounded-full bg-accent px-4 text-[14px] font-bold text-white transition-colors hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isPending ? "Mengirim…" : parentId ? "Balas" : "Posting"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-2 pl-[3.25rem] text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
