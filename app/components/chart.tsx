"use client";

import React, { useState } from "react";

type Point = {
	date: string;
	numberOfLots: number;
};

type ChartProps = {
	numberOfLayers?: number;
	data?: Point[];
	segments?: Point[][];
};

const LineChart = ({ data, numberOfLayers = 1, segments }: ChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;
	const [hovered, setHovered] = useState<number | null>(null);

	const pointsData = segments ? segments.flat() : data ?? [];
	const layerCount = segments ? segments.length : numberOfLayers;

	const maxY = Math.max(...pointsData.map((item) => item.numberOfLots));
	const minY = Math.min(...pointsData.map((item) => item.numberOfLots));
	const guides = Array.from({ length: 16 }, (_, i) => i++);

	function computeX(index: number): number {
		if (!segments) {
			const d = data ?? [];
			return (
				(index % (d.length / numberOfLayers) / (d.length / numberOfLayers)) *
					(chartWidth - paddingX) +
				paddingX / 2
			);
		}
		const POINTS_PER_DAY = 288;
	let cursor = 0;
		for (let s = 0; s < segments.length; s++) {
			if (index < cursor + segments[s].length) {
				const posInSeg = index - cursor;
				return (posInSeg / POINTS_PER_DAY) * (chartWidth - paddingX) + paddingX / 2;
			}
			cursor += segments[s].length;
		}
		return paddingX / 2;
	}

	const properties = pointsData.map((property, index) => {
		const { numberOfLots, date } = property;
		const relativeLotsCount = numberOfLots - minY;
		const x = computeX(index);
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

	const layers = Array.from({ length: layerCount }, (_, i) => i);

	const polylines = (() => {
		if (!segments) {
			const flatPoints = properties.map((p) => `${p.x},${p.y}`);
			return layers.map((layer) => ({
				points: flatPoints
					.slice(
						(layer * flatPoints.length) / numberOfLayers,
						((layer + 1) * flatPoints.length) / numberOfLayers
					)
					.join(" "),
				index: layer,
			}));
		}
		let cursor = 0;
		return segments.map((seg, layer) => {
			const segPoints = properties.slice(cursor, cursor + seg.length);
			cursor += seg.length;
			return {
				points: segPoints.map((p) => `${p.x},${p.y}`).join(" "),
				index: layer,
			};
		});
	})();

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

			{/* Layers */}
			{polylines.map(({ points, index: layer }) => {
				return (
					<polyline
						fill="none"
						className={`stroke-zinc-600`}
						style={{ opacity: `0.${100 - (layerCount - layer) * 10 + 9}` }}
						strokeWidth={2}
						key={`layer-${layer}`}
						points={points}
					/>
				);
			})}

			{/* Live market state point */}
			{segments && properties.length > 0 && (() => {
				const last = properties[properties.length - 1];
				return (
					<>
						<circle className="fill-zinc-600" cx={last.x} cy={last.y} r={4} />
						<circle className="fill-zinc-600" cx={last.x} cy={last.y} r={4}>
							<animate
								attributeName="r"
								values="4;4;8;4"
								keyTimes="0;0.834;0.917;1"
								dur="6s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.8;0.8;0;0.8"
								keyTimes="0;0.834;0.917;1"
								dur="6s"
								repeatCount="indefinite"
							/>
						</circle>
					</>
				);
			})()}

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
			{active && (() => {
				const labelX = Math.min(
					Math.max(active.x, chartWidth * 0.05),
					chartWidth * 0.95
				);
				return (
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
					<text
						x={labelX}
						y={chartHeight - (paddingY - offsetY) + 18}
						textAnchor="middle"
						fontSize={18}
						className="fill-zinc-600 select-none"
					>
						{new Date(active.date).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</text>
				</g>
				);
			})()}
		</svg>
	);
};

export default LineChart;
