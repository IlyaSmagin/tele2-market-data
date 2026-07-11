import PageHeader from "../components/pageHeader";

export default function Home({ children }: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title="Home" />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </div>
      </main>
    </>)
}
