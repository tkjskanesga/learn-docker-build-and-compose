import "./globals.css";

export const metadata = {
  title: {
    default: "Kicau",
    template: "%s / Kicau",
  },
  description:
    "Kicau, tempat berbagi cerita pendek dan percakapan panjang. Dibangun dengan Next.js dan PostgreSQL.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
