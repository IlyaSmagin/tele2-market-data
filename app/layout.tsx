import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import Link from "next/link";
import ThemeToggle from "./components/themeToggle";
import Button from "./components/button";

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
      <body className={cn("grid min-h-screen w-full grid-cols-[280px_1fr] dark:bg-black dark:text-gray-100", inter.className)}>
        <aside className="flex flex-col border-r bg-background">
          <div className="flex h-16 items-center justify-center border-b">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              Tele2 Market
              <span className="sr-only">Acme Inc</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-2 px-4">
              <Link href="/home" >
                <Button>
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  Dashboard
                </Button>
              </Link>
              <Link href="internet">
                <Button>
                  Internet
                </Button>
              </Link>
              <Button disabled >
                Calls
              </Button>
              <Button disabled >
                Messages
              </Button>
              <Button disabled >
                Settings
              </Button>
              <ThemeToggle />
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
