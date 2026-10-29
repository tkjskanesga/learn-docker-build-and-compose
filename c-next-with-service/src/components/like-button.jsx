"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/actions/posts";
import { IconHeart } from "@/components/icons";
import { formatCount } from "@/lib/format";

export function LikeButton({ postId, liked, count, compact = false }) {
  const [optimistic, setOptimistic] = useOptimistic(
    { liked, count },
    (state) => ({
      liked: !state.liked,
      count: state.liked ? state.count - 1 : state.count + 1,
    }),
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      setOptimistic();
      await toggleLike(postId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={optimistic.liked}
      aria-label={
        optimistic.liked
          ? `Batal suka, ${optimistic.count} suka`
          : `Suka, ${optimistic.count} suka`
      }
      className={`group -ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-muted transition-colors hover:text-like disabled:opacity-70 ${
        optimistic.liked ? "text-like" : ""
      }`}
    >
      <span
        key={String(optimistic.liked)}
        className={`rounded-full p-1.5 group-hover:bg-like/10 ${
          optimistic.liked ? "like-pop" : ""
        }`}
      >
        <IconHeart
          filled={optimistic.liked}
          className={compact ? "size-[18px]" : "size-5"}
        />
      </span>
      {optimistic.count > 0 ? (
        <span className="min-w-2 text-[13px] tabular-nums">
          {formatCount(optimistic.count)}
        </span>
      ) : null}
    </button>
  );
}
