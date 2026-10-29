import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { IconReply } from "@/components/icons";
import { LikeButton } from "@/components/like-button";
import { formatCount, timeAgo } from "@/lib/format";

export function PostCard({
  post,
  variant = "feed",
  showRail = false,
  hideBorder = false,
}) {
  const isDetail = variant === "detail";

  return (
    <article
      className={`relative flex gap-3 px-4 transition-colors ${
        hideBorder ? "" : "border-b border-line"
      } ${isDetail ? "pb-2 pt-3" : "py-3"} hover:bg-hover/60`}
    >
      {showRail ? (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[35px] top-[3.4rem] w-0.5 bg-line"
        />
      ) : null}

      <div className="relative z-10">
        <Avatar user={post.author} size={isDetail ? "lg" : "md"} link />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0 text-[15px] leading-5">
          <Link
            href={`/u/${post.author.username}`}
            className="max-w-full truncate font-bold hover:underline"
          >
            {post.author.displayName}
          </Link>
          <span className="truncate text-muted">@{post.author.username}</span>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <Link
            href={`/p/${post.id}`}
            className="text-muted hover:underline"
            aria-label={`Lihat kiriman, ${timeAgo(post.createdAt)}`}
          >
            {timeAgo(post.createdAt)}
          </Link>
        </div>

        <Link
          href={`/p/${post.id}`}
          className={`mt-0.5 block whitespace-pre-wrap break-words ${
            isDetail
              ? "text-[17px] leading-[1.45]"
              : "text-[15px] leading-[1.35]"
          }`}
        >
          {post.content}
        </Link>

        <div
          className={`flex items-center gap-6 ${isDetail ? "mt-3" : "mt-2.5"}`}
        >
          <Link
            href={`/p/${post.id}`}
            aria-label={`Balas, ${post.replyCount} balasan`}
            className="group -ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-muted transition-colors hover:text-accent"
          >
            <span className="rounded-full p-1.5 group-hover:bg-accent-soft">
              <IconReply className={isDetail ? "size-[19px]" : "size-[18px]"} />
            </span>
            {post.replyCount > 0 ? (
              <span className="min-w-2 text-[13px] tabular-nums">
                {formatCount(post.replyCount)}
              </span>
            ) : null}
          </Link>

          <LikeButton
            postId={post.id}
            liked={post.liked}
            count={post.likeCount}
          />
        </div>
      </div>
    </article>
  );
}
