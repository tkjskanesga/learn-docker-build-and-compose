import Link from "next/link";
import { avatarColor, initials } from "@/lib/format";

const sizes = {
  sm: "size-8 text-[11px]",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-[8.5rem] text-3xl",
};

export function Avatar({ user, size = "md", link = false, className = "" }) {
  const content = (
    <span
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ring-1 ring-black/5 ${sizes[size]} ${className}`}
      style={{ backgroundColor: avatarColor(user.username) }}
      aria-hidden="true"
    >
      {initials(user.displayName, user.username)}
    </span>
  );

  if (!link) {
    return content;
  }

  return (
    <Link
      href={`/u/${user.username}`}
      className="rounded-full transition-opacity hover:opacity-85"
      aria-label={`Profil ${user.displayName}`}
    >
      {content}
    </Link>
  );
}
