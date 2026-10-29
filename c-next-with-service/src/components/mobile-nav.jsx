"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import {
  IconHome,
  IconLogout,
  IconPlus,
  IconSearch,
  IconUser,
} from "@/components/icons";

export function MobileNav({ user }) {
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
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-background/95 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md sm:hidden"
    >
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={item.active ? "page" : undefined}
            className={`flex size-12 items-center justify-center rounded-full transition-colors ${
              item.active ? "text-foreground" : "text-muted"
            }`}
          >
            <Icon filled={item.active} className="size-6" />
          </Link>
        );
      })}

      <Link
        href="/compose"
        aria-label="Tulis kiriman baru"
        className="flex size-11 items-center justify-center rounded-full bg-accent text-white active:scale-95"
      >
        <IconPlus className="size-5" />
      </Link>

      <Link
        href={profileHref}
        aria-label="Profil"
        aria-current={pathname.startsWith("/u/") ? "page" : undefined}
        className={`flex size-12 items-center justify-center rounded-full transition-colors ${
          pathname.startsWith("/u/") ? "text-foreground" : "text-muted"
        }`}
      >
        <IconUser filled={pathname.startsWith("/u/")} className="size-6" />
      </Link>

      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Keluar"
          className="flex size-12 items-center justify-center rounded-full text-muted transition-colors hover:bg-hover"
        >
          <IconLogout className="size-6" />
        </button>
      </form>
    </nav>
  );
}
