import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { BackButton } from "@/components/back-button";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { requireUser } from "@/lib/auth";
import { getProfile, getUserPosts } from "@/lib/data";
import { joinedAt } from "@/lib/format";

function ProfileCover() {
  return (
    <div className="relative h-[150px] overflow-hidden bg-[#0a3850] sm:h-[190px]">
      <svg
        viewBox="0 0 600 190"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <path
          d="M-20 148C80 82 190 176 306 112S500 56 630 124"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.5"
        />
        <path
          d="M-20 176C92 120 196 196 322 142S512 92 630 156"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.5"
        />
        {[
          [86, 118, 5],
          [306, 112, 7],
          [468, 82, 4],
        ].map(([cx, cy, r]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="#1d9bf0"
            opacity="0.9"
          />
        ))}
      </svg>
      <div className="absolute bottom-3 right-4 text-[12px] font-semibold tracking-wide text-white/35">
        kicau
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await getProfile(String(username).toLowerCase());

  return {
    title: profile ? `@${profile.username}` : "Profil tidak ditemukan",
  };
}

export default async function ProfilePage({ params, searchParams }) {
  const viewer = await requireUser();
  const { username } = await params;
  const query = await searchParams;
  const tab = query?.tab === "replies" ? "replies" : "posts";
  const profile = await getProfile(String(username).toLowerCase());

  if (!profile) {
    notFound();
  }

  const items = await getUserPosts(profile.id, viewer.id, tab);
  const isSelf = profile.id === viewer.id;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[53px] items-center gap-5 border-b border-line bg-background/85 px-4 backdrop-blur-md">
        <BackButton />
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-bold leading-tight">
            {profile.displayName}
          </h1>
          <p className="truncate text-[12.5px] text-muted">
            {profile.postCount} postingan
          </p>
        </div>
      </header>

      <ProfileCover />

      <div className="relative px-4">
        <div className="-mt-[4.25rem] inline-flex rounded-full border-4 border-background bg-background">
          <Avatar user={profile} size="xl" />
        </div>

        {isSelf ? (
          <span className="float-right mt-2 rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-muted">
            Profilmu
          </span>
        ) : null}

        <div className="mt-3">
          <h2 className="text-[20px] font-extrabold leading-tight tracking-tight">
            {profile.displayName}
          </h2>
          <p className="text-[14.5px] text-muted">@{profile.username}</p>
        </div>

        {profile.bio ? (
          <p className="mt-3 text-[15px] leading-relaxed">{profile.bio}</p>
        ) : null}

        <p className="mt-3 flex items-center gap-1.5 text-[14px] text-muted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            className="size-[17px]"
            aria-hidden="true"
          >
            <rect x="3.5" y="5" width="17" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3.5 10h17" />
          </svg>
          Bergabung {joinedAt(profile.createdAt)}
        </p>

        <p className="mt-3 flex gap-4 text-[14px]">
          <span>
            <strong className="font-bold tabular-nums">
              {profile.postCount}
            </strong>{" "}
            <span className="text-muted">postingan</span>
          </span>
          <span>
            <strong className="font-bold tabular-nums">
              {profile.likeCount}
            </strong>{" "}
            <span className="text-muted">suka diterima</span>
          </span>
        </p>
      </div>

      <div className="sticky top-[53px] z-10 mt-3 flex border-b border-line bg-background/90 backdrop-blur-md">
        {[
          { key: "posts", label: "Kiriman", href: `/u/${profile.username}` },
          {
            key: "replies",
            label: "Balasan",
            href: `/u/${profile.username}?tab=replies`,
          },
        ].map((item) => {
          const active = tab === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex-1 py-3 text-center text-[14.5px] transition-colors hover:bg-hover ${
                active ? "font-bold" : "text-muted"
              }`}
            >
              {item.label}
              {active ? (
                <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-14 rounded-full bg-accent" />
              ) : null}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={tab === "posts" ? "Belum ada kiriman" : "Belum ada balasan"}
          body={
            tab === "posts"
              ? `Saat @${profile.username} menulis, kirimannya akan muncul di sini.`
              : `Balasan dari @${profile.username} akan muncul di sini.`
          }
        />
      ) : (
        items.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </>
  );
}
