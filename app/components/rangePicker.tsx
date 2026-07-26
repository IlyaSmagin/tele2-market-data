"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
	RangeSelection,
	RangeMode,
	VOLUME_MIN,
	VOLUME_MAX,
	parseRangeParams,
	selectionToParams,
} from "@/lib/range";

type RangePickerProps = {
	selection: RangeSelection;
	className?: string;
	unitLabel?: string;
	volumeMin?: number;
	volumeMax?: number;
};

const MODE_LABELS: { mode: RangeMode; label: string }[] = [
	{ mode: "top", label: "Top 5" },
	{ mode: "least", label: "Least 5" },
	{ mode: "custom", label: "Custom range" },
];

const RangePicker = ({ selection, className, unitLabel = "GB", volumeMin = VOLUME_MIN, volumeMax = VOLUME_MAX }: RangePickerProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [min, setMin] = useState(
		selection.mode === "custom" ? selection.min : volumeMin
	);
	const [max, setMax] = useState(
		selection.mode === "custom" ? selection.max : volumeMax
	);

	// Keep local inputs in sync when the URL changes externally.
	useEffect(() => {
		const parsed = parseRangeParams({
			mode: searchParams.get("mode") ?? undefined,
			min: searchParams.get("min") ?? undefined,
			max: searchParams.get("max") ?? undefined,
		}, volumeMin, volumeMax);
		if (parsed.mode === "custom") {
			setMin(parsed.min);
			setMax(parsed.max);
		}
	}, [searchParams]);

	const push = (next: RangeSelection) => {
		router.replace(`${pathname}?${selectionToParams(next)}`);
	};

	const selectMode = (mode: RangeMode) => {
		if (mode === "top") push({ mode: "top" });
		else if (mode === "least") push({ mode: "least" });
		else push({ mode: "custom", min, max });
	};

	const applyCustom = () => {
		const lo = Math.min(min, max);
		const hi = Math.max(min, max);
		push({ mode: "custom", min: lo, max: hi });
	};

	const isActive = (mode: RangeMode) => selection.mode === mode;

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 p-2 dark:border-zinc-800",
				className
			)}
		>
			{MODE_LABELS.map(({ mode, label }) => (
				<button
					key={mode}
					type="button"
					onClick={() => selectMode(mode)}
					className={cn(
						"inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
						isActive(mode)
							? "bg-zinc-900 text-white dark:bg-white dark:text-black"
							: "text-zinc-600 hover:bg-gray-400/30 dark:text-zinc-400"
					)}
				>
					{label}
				</button>
			))}

			{selection.mode === "custom" && (
				<div className="flex items-center gap-1 pl-1 text-sm text-zinc-500 dark:text-zinc-400">
					<input
						type="number"
						min={volumeMin}
						max={volumeMax}
						value={min}
						onChange={(e) => setMin(Number(e.target.value))}
						className="h-8 w-16 rounded-md border border-zinc-300 bg-transparent px-2 text-right dark:border-zinc-700"
						aria-label="Minimum volume tier"
					/>
					<span>–</span>
					<input
						type="number"
						min={volumeMin}
						max={volumeMax}
						value={max}
						onChange={(e) => setMax(Number(e.target.value))}
						className="h-8 w-16 rounded-md border border-zinc-300 bg-transparent px-2 text-right dark:border-zinc-700"
						aria-label="Maximum volume tier"
					/>
					<span className="pr-1">{unitLabel}</span>
					<button
						type="button"
						onClick={applyCustom}
						className="inline-flex h-8 items-center rounded-md bg-zinc-900 px-3 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
					>
						Apply
					</button>
				</div>
			)}
		</div>
	);
};

export default RangePicker;
