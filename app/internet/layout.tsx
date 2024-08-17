import Link from 'next/link';


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    {/* TODO move header to reusable component */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 backdrop-blur-sm">
          <h1 className="text-lg font-semibold">Internet</h1>
          <div className="ml-auto flex items-center gap-4">
          </div>
        </header>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <div className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
              {children}
            </div>
          </div>
    </>
  );
}
