type PageHeaderProps = {
	title: string;
	children?: React.ReactNode;
};

export default function PageHeader({ title, children }: PageHeaderProps) {
	return (
		<header className="hidden sticky top-0 z-30 md:flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 backdrop-blur-sm">
			<h1 className="text-lg font-semibold">{title}</h1>
			{children && <div className="ml-auto flex items-center gap-4">{children}</div>}
		</header>
	);
}
