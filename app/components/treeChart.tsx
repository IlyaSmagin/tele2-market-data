"use server";

import React from "react";

type TreeChartProps = {
	data: number[];
};

type TreeItem = {
	index: number;
	value: number;
	weight: number;
};

type TreeTile = TreeItem & {
	x: number;
	y: number;
	width: number;
	height: number;
};

const splitItems = (items: TreeItem[]) => {
	const total = items.reduce((sum, item) => sum + item.weight, 0);
	let running = 0;
	let splitIndex = 1;

	for (let index = 0; index < items.length - 1; index += 1) {
		running += items[index].weight;
		splitIndex = index + 1;
		if (running >= total / 2) break;
	}

	return [items.slice(0, splitIndex), items.slice(splitIndex)] as const;
};

const layoutTree = (
	items: TreeItem[],
	x: number,
	y: number,
	width: number,
	height: number,
): TreeTile[] => {
	if (items.length === 0) return [];
	if (items.length === 1) return [{ ...items[0], x, y, width, height }];

	const [first, second] = splitItems(items);
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	const firstWeight = first.reduce((sum, item) => sum + item.weight, 0);
	const ratio = firstWeight / totalWeight;

	if (width >= height) {
		const firstWidth = width * ratio;
		return [
			...layoutTree(first, x, y, firstWidth, height),
			...layoutTree(second, x + firstWidth, y, width - firstWidth, height),
		];
	}

	const firstHeight = height * ratio;
	return [
		...layoutTree(first, x, y, width, firstHeight),
		...layoutTree(second, x, y + firstHeight, width, height - firstHeight),
	];
};

const TreeChart = ({ data }: TreeChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const padding = 24;
	const gap = 2;

	if (data.length === 0) {
		return (
			<div className="flex h-64 items-center justify-center border border-zinc-800 text-sm text-zinc-500">
				No volume distribution data available
			</div>
		);
	}

	// Log weighting keeps low-volume tiers visible when one tier is much larger.
	const items = data
		.map((value, index) => ({
			index,
			value,
			weight: Math.log10(Math.max(0, value) + 1) + 0.15,
		}))
		.sort((a, b) => b.weight - a.weight);

	const tiles = layoutTree(
		items,
		padding,
		padding,
		chartWidth - padding * 2,
		chartHeight - padding * 2,
	);
	const maxValue = Math.max(...data, 1);

	return (
		<svg
			viewBox={`0 0 ${chartWidth} ${chartHeight}`}
			role="img"
			aria-label="Treemap of available lots by gigabyte volume tier"
			className="w-full"
		>
			{tiles.map((tile) => {
				const x = tile.x + gap / 2;
				const y = tile.y + gap / 2;
				const width = Math.max(1, tile.width - gap);
				const height = Math.max(1, tile.height - gap);
				const showLabel = width >= 50 && height >= 34;
				const showValue = width >= 72 && height >= 52;
				const intensity = Math.log10(tile.value + 1) / Math.log10(maxValue + 1);
				const fillClass =
					intensity > 0.75
						? "fill-zinc-500"
						: intensity > 0.45
							? "fill-zinc-600"
							: "fill-zinc-800";

				return (
					<g key={tile.index} className="group">
						<title>{`${tile.index + 1} GB: ${tile.value.toLocaleString()} lots`}</title>
						<rect
							x={x}
							y={y}
							width={width}
							height={height}
							rx={3}
							className={`${fillClass} stroke-zinc-700 transition-colors group-hover:fill-zinc-300`}
							strokeWidth={1}
						/>
						{showLabel && (
							<text
								x={x + 8}
								y={y + 17}
								fontSize={12}
								className="pointer-events-none fill-zinc-100 font-semibold group-hover:fill-zinc-950"
							>
								{tile.index + 1} GB
							</text>
						)}
						{showValue && (
							<text
								x={x + 8}
								y={y + 34}
								fontSize={10}
								className="pointer-events-none fill-zinc-300 group-hover:fill-zinc-800"
							>
								{tile.value.toLocaleString()} lots
							</text>
						)}
					</g>
				);
			})}
		</svg>
	);
};

export default TreeChart;
