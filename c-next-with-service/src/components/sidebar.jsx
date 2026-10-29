"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Avatar } from "@/components/avatar";
import { IconHome, IconLogout, IconSearch, IconUser } from "@/components/icons";

function navClass(active) {
  return [
    "group flex items-center gap-4 rounded-full p-3 text-xl transition-colors",
    "hover:bg-hover focus-visible:bg-hover",
    active ? "font-bold" : "font-normal text-foreground",
  ].join(" ");
}

export function Sidebar({ user }) {
  const pathname = usePathname();
  const profileHref = `/u/${user.username}`;

  const items = [
    {
      href: "/",
      label: "Beranda",
      icon: IconHome,
      active: pathname === "/",
    },
    {
      href: "/search",
      label: "Cari",
      icon: IconSearch,
      active: pathname.startsWith("/search"),
    },
    {
      href: profileHref,
      label: "Profil",
      icon: IconUser,
      active: pathname.startsWith("/u/"),
    },
  ];

  return (
    <div className="sticky top-0 hidden h-dvh w-[88px] shrink-0 flex-col justify-between px-2 py-3 sm:flex xl:w-[275px] xl:px-3">
      <div className="flex flex-col items-center gap-2 xl:items-stretch">
        <Link
          href="/"
          aria-label="Kicau, ke beranda"
          className="mb-1 flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-hover xl:px-3"
        >
          <span className="flex size-10 items-center justify-center rounded-[13px] bg-accent text-[22px] font-black leading-none text-white">
            k
          </span>
          <span className="hidden text-[22px] font-extrabold tracking-tight xl:block">
            kicau
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(item.active)}
                aria-current={item.active ? "page" : undefined}
              >
                <span className="relative">
                  <Icon filled={item.active} />
                </span>
                <span className="hidden xl:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/compose"
          className="mt-4 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover active:scale-[0.98] xl:w-full"
        >
          <span className="hidden text-[17px] font-bold xl:block">Posting</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-6 xl:hidden"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="sr-only xl:hidden">Tulis kiriman baru</span>
        </Link>
      </div>

      <div className="mb-2 flex flex-col items-center gap-2 xl:flex-row xl:justify-between xl:rounded-full xl:p-2 xl:hover:bg-hover">
        <Link
          href={`/u/${user.username}`}
          className="flex min-w-0 items-center gap-3 rounded-full p-1 xl:flex-1"
        >
          <Avatar user={user} size="md" />
          <span className="hidden min-w-0 leading-tight xl:block">
            <span className="block truncate text-[15px] font-bold">
              {user.displayName}
            </span>
            <span className="block truncate text-[14px] text-muted">
              @{user.username}
            </span>
          </span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Keluar"
            title="Keluar"
            className="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <IconLogout className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
