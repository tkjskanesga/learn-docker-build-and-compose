"use client";

export default function AppError({ error, reset }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-[18px] bg-danger/10 text-2xl font-black text-danger">
        !
      </span>
      <h1 className="mt-6 text-[24px] font-extrabold tracking-tight">
        Ada yang tidak beres
      </h1>
      <p className="mt-2 max-w-[340px] text-[14.5px] leading-relaxed text-muted">
        Kicau gagal memuat halaman ini. Coba lagi sebentar.
      </p>
      {error?.digest ? (
        <p className="mt-2 text-[12px] text-faint">Kode: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Coba lagi
      </button>
    </div>
  );
}
