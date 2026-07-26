"use client";

import React, { useState } from "react";

type Point = {
	date: string;
	numberOfLots: number;
};

type DerivativeChartProps = {
	numberOfLayers?: number;
	data?: Point[];
	segments?: Point[][];
};

// Returns the value at the given percentile (0-1) of a numeric array.
const percentile = (sorted: number[], p: number) => {
	if (sorted.length === 0) return 0;
	const index = (sorted.length - 1) * p;
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	if (lower === upper) return sorted[lower];
	return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

// Shows the rate of change (derivative) of the number of 1 GB lots between
// consecutive data points. Positive values mean lots are being added to the
// market, negative values mean they are being sold/removed.
//
// Anomalies such as end-of-day bulk deletions produce huge one-off spikes that
// dominate the vertical scale and drown out the meaningful day-to-day flow. To
// keep the derivative smooth we winsorize the deltas: values outside the
// interquartile whiskers (Tukey's 1.5*IQR fences) are clamped to those bounds
// so a single anomaly no longer squashes the rest of the chart.
const DerivativeChart = ({ data, numberOfLayers = 1, segments }: DerivativeChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	const pointsData = segments ? segments.flat() : data ?? [];
	const layerCount = segments ? segments.length : numberOfLayers;

	// Raw derivative: difference between each point and the previous one.
	// First point has no predecessor, so its rate of change is 0.
	const rawDeltas = pointsData.map((point, index) =>
		index === 0 ? 0 : point.numberOfLots - pointsData[index - 1].numberOfLots
	);

	// Robust bounds via the interquartile range (ignores the first zero-pad point).
	const sorted = [...rawDeltas.slice(1)].sort((a, b) => a - b);
	const q1 = percentile(sorted, 0.25);
	const q3 = percentile(sorted, 0.75);
	const median = percentile(sorted, 0.5);
	const iqr = q3 - q1;
	const lowerFence = q1 - 1.5 * iqr;
	const upperFence = q3 + 1.5 * iqr;

	// A delta is an anomaly if it falls outside Tukey's fences (e.g. an
	// end-of-day bulk deletion). Anomalies are replaced with the median delta so
	// the line flows smoothly instead of spiking; the raw value is kept for the
	// hover label so the anomaly is still discoverable.
	const isOutlier = (value: number) =>
		value < lowerFence || value > upperFence;

	const derivative = pointsData.map((point, index) => {
		const raw = rawDeltas[index];
		const smoothed = isOutlier(raw);
		return {
			date: point.date,
			delta: smoothed ? median : raw,
			rawDelta: raw,
			clamped: smoothed,
		};
	});

	const maxY = Math.max(...derivative.map((item) => item.delta));
	const minY = Math.min(...derivative.map((item) => item.delta));
	// Non-zero range so the zero line sits sensibly in the chart.
	const range = maxY - minY || 1;

	const guides = Array.from({ length: 16 }, (_, i) => i);
	const layers = Array.from({ length: layerCount }, (_, i) => i);

	const toY = (delta: number) =>
		chartHeight -
		((delta - minY) / range) * (chartHeight - (paddingY + offsetY)) -
		paddingY;

	function computeX(index: number): number {
		if (!segments) {
			return (
				((index % (pointsData.length / numberOfLayers)) /
					(pointsData.length / numberOfLayers)) *
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

	const properties = derivative.map((property, index) => {
		const { delta, date, rawDelta, clamped } = property;
		const x = computeX(index);
		return {
			delta,
			rawDelta,
			clamped,
			date,
			x,
			y: toY(delta),
		};
	});

	const polylines = (() => {
		const flatPoints = properties.map((p) => `${p.x},${p.y}`);
		if (!segments) {
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

	const zeroY = toY(0);

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
						points={`${paddingX / 2},${y} ${chartWidth - paddingX / 2},${y}`}
					/>
				);
			})}

			{/* Zero baseline */}
			<polyline
				className="stroke-zinc-500"
				fill="none"
				strokeWidth={1.5}
				strokeDasharray="6 4"
				points={`${paddingX / 2},${zeroY} ${chartWidth - paddingX / 2},${zeroY}`}
			/>

			{/* Derivative line(s), folded into layers */}
			{polylines.map(({ points, index: layer }) => (
				<polyline
					fill="none"
					className="stroke-zinc-600"
					style={{ opacity: `0.${100 - (layerCount - layer) * 10 + 9}` }}
					strokeWidth={2}
					key={`layer-${layer}`}
					points={points}
				/>
			))}

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
			{hovered !== null &&
				(() => {
					const { delta, rawDelta, clamped, date, x, y } = properties[hovered];
					return (
						<g className="pointer-events-none">
							<circle
								className={
									clamped
										? "stroke-zinc-400 fill-black"
										: "stroke-zinc-500 fill-black"
								}
								cx={x}
								cy={y}
								r={20}
								strokeWidth={2}
								strokeDasharray={clamped ? "3 3" : undefined}
							/>
							<text
								x={x}
								y={y + 2.8}
								textAnchor="middle"
								fontSize={8}
								className="font-bold fill-zinc-100 select-none"
							>
								{clamped
									? `${rawDelta > 0 ? "+" : ""}${rawDelta}`
									: delta > 0
									? `+${delta}`
									: delta}
							</text>

							<g
								transform={`translate(${x} ${
									chartHeight - (paddingY - offsetY)
								})`}
							>
								<text
									transform="rotate(45)"
									textAnchor="start"
									fontSize={10}
									className="fill-zinc-600 select-none"
								>
									{new Date(date).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</text>
							</g>
						</g>
					);
				})()}
		</svg>
	);
};

export default DerivativeChart;
