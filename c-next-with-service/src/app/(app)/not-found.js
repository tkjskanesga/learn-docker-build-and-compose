import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-[18px] bg-accent text-2xl font-black text-white">
        k
      </span>
      <h1 className="mt-6 text-[24px] font-extrabold tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-[320px] text-[14.5px] leading-relaxed text-muted">
        Kiriman atau profil yang kamu cari mungkin sudah dihapus, atau tautannya
        salah.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
