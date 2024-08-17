export default function Button(
  { children, ...htmlButtonProps }:
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode; // This will hold the content inside the button
    }) {
  return (
    <button {...htmlButtonProps} className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-400/30 h-9 px-3 py-2">
      {children}
    </button>
  );
}