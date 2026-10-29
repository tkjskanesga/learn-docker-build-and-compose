"use client";

import { useRouter } from "next/navigation";
import { IconBack } from "@/components/icons";

export function BackButton({ fallback = "/" }) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Kembali"
      className="-ml-2 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-hover"
    >
      <IconBack />
    </button>
  );
}
