import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { SearchField } from "@/components/search-field";
import { getSuggestedUsers } from "@/lib/data";

export async function RightRail({ viewerId }) {
  const suggestions = await getSuggestedUsers(viewerId);

  return (
    <aside className="sticky top-0 hidden h-dvh w-[350px] shrink-0 flex-col gap-4 overflow-y-auto px-6 py-3 lg:flex">
      <div className="sticky top-0 z-10 bg-background pb-1 pt-1">
        <SearchField />
      </div>

      <section className="rounded-2xl bg-surface px-4 py-3">
        <h2 className="mb-2 text-[19px] font-extrabold tracking-tight">
          Untukmu
        </h2>
        {suggestions.length === 0 ? (
          <p className="pb-2 text-[14px] text-muted">
            Belum ada orang lain di sini.
          </p>
        ) : (
          <ul className="divide-y divide-line/70">
            {suggestions.map((person) => (
              <li key={person.id}>
                <Link
                  href={`/u/${person.username}`}
                  className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-background/70"
                >
                  <Avatar user={person} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-bold leading-tight">
                      {person.displayName}
                    </span>
                    <span className="block truncate text-[13.5px] text-muted">
                      @{person.username}
                    </span>
                    {person.bio ? (
                      <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-muted">
                        {person.bio}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/search"
          className="mt-1 block rounded-lg px-1 py-2 text-[14px] font-medium text-accent hover:underline"
        >
          Lihat orang lain
        </Link>
      </section>

      <footer className="px-1 pb-6 text-[12px] leading-relaxed text-muted">
        <p className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Tentang</span>
          <span aria-hidden="true">·</span>
          <span>Dibangun dengan Next.js</span>
          <span aria-hidden="true">·</span>
          <span>PostgreSQL</span>
        </p>
        <p className="mt-1 text-faint">© 2026 Kicau</p>
      </footer>
    </aside>
  );
}
