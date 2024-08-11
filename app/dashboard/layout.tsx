import Link from 'next/link';


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr] overflow-hidden">
      <aside className="flex flex-col border-r bg-background">
        <div className="flex h-16 items-center justify-center border-b">
          <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
            Tele2 Market
            <span className="sr-only">Acme Inc</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-2 px-4">
          <Link href="/" className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 px-3 py-2">
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
      <div className="flex flex-col"><header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">


          </div>
        </header>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <input type="text" />

          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
      </div>
      </div>
    </>
  );
}
