import { cn } from "@/lib/utils";

type StatCardProps = {
	label: string;
	value: number;
	deltaPct: number;
	deltaCaption?: string;
	className?: string;
};

const formatValue = (value: number) => Math.round(value).toLocaleString();

const StatCard = ({ label, value, deltaPct, deltaCaption, className }: StatCardProps) => {
	const positive = deltaPct >= 0;
	const deltaText =
		(deltaPct > 0 ? "+" : "") + deltaPct.toFixed(1) + "%";

	return (
		<div
			className={cn(
				"rounded-xl border border-zinc-200 bg-white p-5 transition-colors dark:border-zinc-800 dark:bg-black",
				className
			)}
		>
			<p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
				{label}
			</p>
			<p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
				{formatValue(value)}
			</p>
			<p
				className={cn(
					"mt-1 text-sm font-medium",
					positive ? "text-emerald-500" : "text-red-500"
				)}
			>
				<span aria-hidden="true">{positive ? "▲" : "▼"}</span> {deltaText}
				{deltaCaption ? (
					<span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">
						{deltaCaption}
					</span>
				) : null}
			</p>
		</div>
	);
};

export default StatCard;
