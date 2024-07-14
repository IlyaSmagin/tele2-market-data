import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={inter.className}>
		    <main className="flex min-h-screen flex-col items-center justify-between px-24 pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
