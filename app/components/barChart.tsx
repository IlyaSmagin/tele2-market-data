"use client";

import React, { useState } from "react";

type BarChartProps = {
	data: number[];
	unitLabel?: string;
	volumeLabels?: number[];
};

const BarChart = ({ data, unitLabel = "GB", volumeLabels }: BarChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	const maxY = Math.max(...data);
	const minY = Math.max(1, Math.min(...data));

	// Log scale fitted to the actually rendered bars so the axis rescales
	// with the selected range (floor at 1 so log10(0) is avoided).
	const logMin = Math.log10(minY);
	const logMax = Math.log10(maxY);

	// One guide line per power of 10 within the rendered range.
	const powers: number[] = [];
	for (let p = Math.floor(logMin); p <= Math.ceil(logMax); p++) {
		powers.push(p);
	}

	const drawHeight = chartHeight - paddingY - offsetY;

	const barCount = data.length;
	const availableWidth = chartWidth - paddingX;
	const barWidth = availableWidth / barCount;
	const barBodyWidth = Math.max(1, barWidth * 0.7);

	const toX = (index: number) =>
		(index / barCount) * availableWidth + paddingX / 2 + barWidth / 2;

	const logSpan = logMax - logMin || 1;

	const toY = (value: number) => {
		if (value <= 1) return chartHeight - paddingY;
		const ratio = (Math.log10(value) - logMin) / logSpan;
		return chartHeight - paddingY - ratio * drawHeight;
	};

	const baselineY = chartHeight - paddingY;

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guide lines at each power of 10 */}
			{powers.map((p) => {
				const tickValue = Math.pow(10, p);
				const y = toY(tickValue);
				const label =
					tickValue >= 1_000_000
						? `${tickValue / 1_000_000}M`
						: tickValue >= 1_000
						? `${tickValue / 1_000}K`
						: String(tickValue);
				return (
					<g key={p}>
						<polyline
							className="stroke-zinc-800"
							fill="none"
							strokeWidth={1}
							points={`${paddingX / 2},${y} ${chartWidth - paddingX / 2},${y}`}
						/>
						<text
							x={paddingX / 2 - 4}
							y={y + 4}
							textAnchor="end"
							fontSize={9}
							className="fill-zinc-500 select-none"
						>
							{label}
						</text>
					</g>
				);
			})}

			{/* Bars */}
			{data.map((value, index) => {
				const cx = toX(index);
				const barTop = toY(value);
				const barHeight = Math.max(1, baselineY - barTop);
				const showLabel = index % 10 === 0;
				const isHot = hovered === index;

				return (
					<g key={index}>
						<rect
							x={cx - barBodyWidth / 2}
							y={barTop}
							width={barBodyWidth}
							height={barHeight}
							className={
								isHot
									? "fill-zinc-400 stroke-zinc-600 transition-colors"
									: "fill-zinc-700 stroke-zinc-600 transition-colors"
							}
							strokeWidth={1}
							onMouseEnter={() => setHovered(index)}
							onMouseLeave={() => setHovered((h) => (h === index ? null : h))}
						/>

						{/* X-axis label every 10 bars */}
						{showLabel && (
							<g transform={`translate(${cx} ${chartHeight - (paddingY - offsetY)})`}>
								<text
									transform="rotate(45)"
									textAnchor="start"
									fontSize={10}
									className="fill-zinc-600 select-none"
								>
									{volumeLabels ? volumeLabels[index] : index + 1} {unitLabel}
								</text>
							</g>
						)}
					</g>
				);
			})}

			{/* Single shared hover value label */}
			{hovered !== null && (() => {
				const value = data[hovered];
				const cx = toX(hovered);
				const barTop = toY(value);
				return (
					<g className="pointer-events-none">
						<circle
							className="stroke-zinc-500 fill-black"
							cx={cx}
							cy={barTop - 12}
							r={20}
							strokeWidth={2}
						/>
						<text
							x={cx}
							y={barTop - 9}
							textAnchor="middle"
							fontSize={8}
							className="font-bold fill-zinc-100 select-none"
						>
							{value.toLocaleString()}
						</text>
					</g>
				);
			})()}
		</svg>
	);
};

export default BarChart;
