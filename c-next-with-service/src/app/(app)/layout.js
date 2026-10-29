import { MobileNav } from "@/components/mobile-nav";
import { RightRail } from "@/components/right-rail";
import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }) {
  const user = await requireUser();

  return (
    <>
      <div className="mx-auto flex min-h-dvh w-full max-w-[1265px] justify-center">
        <Sidebar user={user} />
        <main className="min-h-dvh w-full min-w-0 max-w-[600px] border-line sm:border-x">
          {children}
          <div className="h-16 sm:hidden" />
        </main>
        <RightRail viewerId={user.id} />
      </div>
      <MobileNav user={user} />
    </>
  );
}
