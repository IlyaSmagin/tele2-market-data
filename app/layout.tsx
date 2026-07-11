import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import Link from "next/link";
import Script from "next/script";
import { NavLinks } from "./components/SidebarNavLinks";
import ThemeToggle from "./components/themeToggle";

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
      <body className={cn("flex min-h-screen w-full flex-col dark:bg-black dark:text-gray-100 md:grid md:grid-cols-[280px_1fr]", inter.className)}>
        {/* Desktop Sidebar */}
        <aside className="hidden md:h-dvh md:sticky md:top-0 md:flex flex-col border-r bg-background">
          <div className="flex h-16 items-center justify-center border-b">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              Tele2 Market
              <span className="sr-only">Tele2 Market</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <NavLinks variant="sidebar" />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex min-h-screen w-full flex-col md:min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between h-16 border-b bg-background px-4">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              Tele2 Market
              <span className="sr-only">Tele2 Market</span>
            </Link>
            <ThemeToggle variant="icon" />
          </header>
          
          {children}
        </main>
        
        {/* Mobile Bottom Navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
          <NavLinks variant="bottom" />
        </nav>
        
        {/* Add padding to main content on mobile to account for bottom navbar */}
        <style>{`
          @media (max-width: 768px) {
            main {
              padding-bottom: 80px;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
