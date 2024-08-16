import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T2Market",
  description: "Tele2 market monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("grid min-h-screen w-full grid-cols-[280px_1fr] ", inter.className)}>
        <aside className="flex flex-col border-r bg-background">
          <div className="flex h-16 items-center justify-center border-b">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              Tele2 Market
              <span className="sr-only">Acme Inc</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-2 px-4">
              <Link href="/home" className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Home
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Dashboard
              </Link>
              <Link href="internet" className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Internet
              </Link>
              <button disabled className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Calls
              </button>
              <button disabled className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Messages
              </button>
              <button disabled className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
                Settings
              </button>
            </nav>
          </div>
        </aside>
        <main className="flex min-h-screen w-full flex-col">
          {children}

        </main>
      </body>
    </html>
  );
}
