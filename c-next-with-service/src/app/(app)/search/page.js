import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { BackButton } from "@/components/back-button";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { SearchField } from "@/components/search-field";
import { requireUser } from "@/lib/auth";
import { getSuggestedUsers, searchPosts, searchUsers } from "@/lib/data";

export const metadata = {
  title: "Cari",
};

export default async function SearchPage({ searchParams }) {
  const viewer = await requireUser();
  const query = await searchParams;
  const raw = typeof query?.q === "string" ? query.q.trim() : "";
  const hasQuery = raw.length > 0;

  const [people, posts, suggestions] = hasQuery
    ? await Promise.all([
        searchUsers(raw),
        searchPosts(raw, viewer.id),
        Promise.resolve([]),
      ])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        getSuggestedUsers(viewer.id),
      ]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-background/90 px-2 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <BackButton fallback="/" />
          <div className="min-w-0 flex-1">
            <SearchField
              id="search-page-input"
              defaultValue={raw}
              autoFocus={!hasQuery}
              label="Cari orang atau kiriman"
            />
          </div>
        </div>
      </header>

      {!hasQuery ? (
        <>
          <div className="px-4 py-5">
            <h1 className="text-[20px] font-extrabold tracking-tight">
              Cari di Kicau
            </h1>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              Ketik username, nama, atau potongan kalimat dari sebuah kiriman.
            </p>
          </div>

          <section className="border-t border-line">
            <h2 className="px-4 py-3 text-[17px] font-extrabold tracking-tight">
              Orang untuk diikuti percakapannya
            </h2>
            {suggestions.length === 0 ? (
              <p className="px-4 pb-8 text-[14px] text-muted">
                Belum ada pengguna lain.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {suggestions.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={`/u/${person.username}`}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-hover"
                    >
                      <Avatar user={person} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold leading-tight">
                          {person.displayName}
                        </span>
                        <span className="block truncate text-[14px] text-muted">
                          @{person.username}
                        </span>
                        {person.bio ? (
                          <span className="mt-0.5 line-clamp-2 block text-[13.5px] leading-snug text-muted">
                            {person.bio}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <>
          <div className="border-b border-line px-4 py-3">
            <h1 className="text-[17px] font-extrabold tracking-tight">
              Hasil untuk “{raw}”
            </h1>
            <p className="text-[13px] text-muted">
              {people.length + posts.length} hasil ditemukan
            </p>
          </div>

          {people.length > 0 ? (
            <section className="border-b border-line">
              <h2 className="px-4 py-2.5 text-[15px] font-bold">Orang</h2>
              <ul className="divide-y divide-line">
                {people.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={`/u/${person.username}`}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-hover"
                    >
                      <Avatar user={person} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold leading-tight">
                          {person.displayName}
                        </span>
                        <span className="block truncate text-[14px] text-muted">
                          @{person.username}
                        </span>
                        {person.bio ? (
                          <span className="mt-0.5 line-clamp-1 block text-[13.5px] text-muted">
                            {person.bio}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section>
              <h2 className="border-b border-line px-4 py-2.5 text-[15px] font-bold">
                Kiriman
              </h2>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </section>
          ) : null}

          {people.length === 0 && posts.length === 0 ? (
            <EmptyState
              title="Tidak ada hasil"
              body={`Tidak ada orang atau kiriman yang cocok dengan “${raw}”. Coba kata lain.`}
            />
          ) : null}
        </>
      )}
    </>
  );
}
