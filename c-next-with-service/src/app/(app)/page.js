import Link from "next/link";
import { Composer } from "@/components/composer";
import { EmptyState } from "@/components/empty-state";
import { IconSpark } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { requireUser } from "@/lib/auth";
import { getFeed } from "@/lib/data";

export const metadata = {
  title: "Beranda",
};

export default async function HomePage() {
  const user = await requireUser();
  const feed = await getFeed(user.id);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[53px] items-center justify-between border-b border-line bg-background/85 px-4 backdrop-blur-md">
        <h1 className="text-[20px] font-extrabold tracking-tight">Beranda</h1>
        <Link
          href="/compose"
          className="flex size-9 items-center justify-center rounded-full text-accent transition-colors hover:bg-accent-soft"
          aria-label="Tulis kiriman baru"
        >
          <IconSpark className="size-[18px]" />
        </Link>
      </header>

      <Composer user={user} redirectTo="/" />

      {feed.length === 0 ? (
        <EmptyState
          title="Belum ada kicauan"
          body="Mulai percakapan pertama. Tulis satu pikiran, lalu biarkan orang lain menimpali."
          actionHref="/compose"
          actionLabel="Tulis kiriman"
        />
      ) : (
        <div>
          {feed.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
