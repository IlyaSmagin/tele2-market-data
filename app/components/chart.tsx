"use client";

import React, { useState } from "react";

type ChartProps = {
	numberOfLayers?: number;
	data: {
		date: string;
		numberOfLots: number;
	}[];
};

const LineChart = ({ data, numberOfLayers = 1 }: ChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;
	const [hovered, setHovered] = useState<number | null>(null);

	const maxY = Math.max(...data.map((item) => item.numberOfLots));
	const minY = Math.min(...data.map((item) => item.numberOfLots));
	const guides = Array.from({ length: 16 }, (_, i) => i++);
	const layers = Array.from({ length: numberOfLayers }, (_, i) => i++);

	const properties = data.map((property, index) => {
		const { numberOfLots, date } = property;
		const relativeLotsCount = numberOfLots - minY;
		const x =
			(index % (data.length / numberOfLayers) / (data.length / numberOfLayers)) *
				(chartWidth - paddingX) +
			paddingX / 2;
		const y =
			chartHeight -
			(relativeLotsCount / (maxY - minY)) *
				(chartHeight - (paddingY + offsetY)) -
			paddingY;
		return {
			total: numberOfLots,
			date: date,
			x: x,
			y: y,
		};
	});

	const points = properties.map((point) => {
		const { x, y } = point;
		return `${x},${y}`;
	});

	const active = hovered !== null ? properties[hovered] : null;

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guides */}
			{guides.map((index) => {
				const ratio = index / (guides.length - 1);
				const y = chartHeight - paddingY - chartHeight * ratio;

				return (
					<polyline
						key={index}
						className="stroke-zinc-800"
						fill="none"
						strokeWidth={1}
						points={`${paddingX / 2},${y} ${
							chartWidth - paddingX / 2
						},${y}`}
					/>
				);
			})}

			{/* Main line */}
			{layers.map((layer) => {
				return (
					<polyline
						fill="none"
						className={`stroke-zinc-600`}
						style={{ opacity: `0.${100 - (layers.length - layer) * 10 + 9}` }}
						strokeWidth={2}
						key={`layer-${layer}`}
						points={points
							.slice(
								(layer * points.length) / numberOfLayers,
								((layer + 1) * points.length) / numberOfLayers
							)
							.join(" ")}
					/>
				);
			})}

			{/* Single transparent overlay — nearest-point hover, no per-point DOM */}
			<rect
				x={paddingX / 2}
				y={offsetY}
				width={chartWidth - paddingX}
				height={chartHeight - paddingY - offsetY}
				fill="transparent"
				className="cursor-pointer"
				onMouseMove={(e) => {
					const svg = e.currentTarget.ownerSVGElement;
					if (!svg) return;
					const rectBox = svg.getBoundingClientRect();
					const scale = chartWidth / rectBox.width;
					const clientX = (e.clientX - rectBox.left) * scale;
					let nearest = 0;
					let best = Infinity;
					for (let i = 0; i < properties.length; i++) {
						const dx = properties[i].x - clientX;
						// `<=` (not `<`) so that on tied dx — which happens for
						// every day sharing an x-slot in folded charts — the
						// latest (largest index) day wins instead of the first.
						if (dx * dx <= best) {
							best = dx * dx;
							nearest = i;
						}
					}
					setHovered(nearest);
				}}
				onMouseLeave={() => setHovered(null)}
			/>

			{/* Single shared tooltip */}
			{active && (
				<g className="pointer-events-none">
					<circle
						className="stroke-zinc-500 fill-black"
						cx={active.x}
						cy={active.y}
						r={20}
						strokeWidth={2}
					/>
					<text
						x={active.x}
						y={active.y + 2.8}
						textAnchor="middle"
						fontSize={8}
						className="font-bold fill-zinc-100 select-none"
					>
						{active.total}
					</text>
					<g
						transform={`translate(${active.x} ${
							chartHeight - (paddingY - offsetY)
						})`}
					>
						<text
							transform="rotate(45)"
							textAnchor="start"
							fontSize={10}
							className="fill-zinc-600 select-none"
						>
							{new Date(active.date).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</text>
					</g>
				</g>
			)}
		</svg>
	);
};

export default LineChart;
