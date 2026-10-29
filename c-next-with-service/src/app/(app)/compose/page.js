import Link from "next/link";
import { Composer } from "@/components/composer";
import { IconClose } from "@/components/icons";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Posting",
};

export default async function ComposePage() {
  const user = await requireUser();

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[53px] items-center gap-4 border-b border-line bg-background/85 px-2 backdrop-blur-md">
        <Link
          href="/"
          aria-label="Tutup"
          className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-hover"
        >
          <IconClose />
        </Link>
        <h1 className="text-[17px] font-bold">Tulis kiriman</h1>
      </header>

      <Composer
        user={user}
        redirectTo="/"
        autoFocus
        variant="page"
        placeholder="Apa yang sedang terjadi?"
      />

      <p className="mx-4 mt-2 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Tambahkan kiriman lain untuk membuat utas. Kiriman pertama akan menjadi
        awal percakapan, sisanya tersambung sebagai balasan.
      </p>
    </>
  );
}
