import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

function ThreadMotif() {
  return (
    <svg
      viewBox="0 0 320 150"
      role="img"
      aria-label="Ilustrasi tiga kiriman yang terhubung dalam satu utas"
      className="h-[150px] w-full max-w-[320px]"
    >
      <path d="M40 32v88" stroke="var(--line)" strokeWidth="2" />
      {[32, 76, 120].map((top, index) => (
        <g key={top}>
          <circle
            cx="40"
            cy={top}
            r="15"
            fill={index === 0 ? "var(--accent)" : "var(--background)"}
            stroke={index === 0 ? "var(--accent)" : "var(--line)"}
            strokeWidth="2"
          />
          {index === 0 ? (
            <path
              d="M33 32h14M33 38h9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : null}
          <rect
            x="70"
            y={top - 14}
            width={index === 1 ? 172 : 208}
            height="7"
            rx="3.5"
            fill={index === 2 ? "var(--line)" : "var(--foreground)"}
            opacity={index === 2 ? 1 : 0.14}
          />
          <rect
            x="70"
            y={top + 1}
            width={index === 0 ? 196 : 144}
            height="7"
            rx="3.5"
            fill="var(--line)"
          />
        </g>
      ))}
      <path
        d="M286 120c-7.7 0-13-4.3-13-10.2a7 7 0 0 1 13-3.8 7 7 0 0 1 13 3.8c0 5.9-5.3 10.2-13 10.2Z"
        fill="var(--like)"
        opacity="0.9"
      />
    </svg>
  );
}

export default async function AuthLayout({ children }) {
  const user = await getSessionUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-surface px-10 py-10 lg:flex xl:px-14">
        <Link
          href="/login"
          className="flex items-center gap-3 self-start rounded-full p-1"
          aria-label="Kicau"
        >
          <span className="flex size-9 items-center justify-center rounded-[12px] bg-accent text-xl font-black leading-none text-white">
            k
          </span>
          <span className="text-[21px] font-extrabold tracking-tight">
            kicau
          </span>
        </Link>

        <div className="max-w-[420px]">
          <ThreadMotif />
          <h1 className="mt-8 text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em] xl:text-[44px]">
            Percakapan kecil,
            <br />
            ruang yang cukup.
          </h1>
          <p className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-muted">
            Tulis utas, balas, dan simpan percakapan yang layak dibaca ulang.
            Tanpa algoritma yang berisik.
          </p>
        </div>

        <p className="max-w-[320px] text-[12px] leading-relaxed text-muted">
          Data akun dan kiriman tersimpan di PostgreSQL milikmu sendiri.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <Link
            href="/login"
            className="mb-8 flex items-center gap-2.5 lg:hidden"
            aria-label="Kicau"
          >
            <span className="flex size-9 items-center justify-center rounded-[12px] bg-accent text-xl font-black leading-none text-white">
              k
            </span>
            <span className="text-[20px] font-extrabold tracking-tight">
              kicau
            </span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
