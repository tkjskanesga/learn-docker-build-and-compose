import Link from "next/link";
import { IconMessage } from "@/components/icons";

export function EmptyState({ title, body, actionHref, actionLabel }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <IconMessage className="size-7" />
      </span>
      <h2 className="text-[19px] font-extrabold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-[300px] text-[14px] leading-relaxed text-muted">
        {body}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 rounded-full bg-accent px-5 py-2 text-[14px] font-bold text-white transition-colors hover:bg-accent-hover"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
