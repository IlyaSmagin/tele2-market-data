"use client";

import React, { useState } from "react";
import type { TierCandle } from "@/lib/range";

type CandlestickChartProps = {
	data: TierCandle[];
	unitLabel?: string;
};

const CandlestickChart = ({ data, unitLabel = "GB" }: CandlestickChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	if (data.length === 0) {
		return (
			<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation" />
		);
	}

	const maxY = Math.max(...data.map((d) => d.lotMax));
	const minY = Math.max(1, Math.min(...data.map((d) => d.lotMin)));

	// Log scale fitted to the actually rendered tiers so the axis rescales
	// with the selected range (floor at 1 so log10(0) is avoided).
	const logMin = Math.log10(minY);
	const logMax = Math.log10(maxY);
	const logSpan = logMax - logMin || 1;

	const drawHeight = chartHeight - paddingY - offsetY;

	const barCount = data.length;
	const availableWidth = chartWidth - paddingX;
	const barWidth = availableWidth / barCount;
	const candleWidth = Math.max(4, barWidth * 0.45);

	const toX = (index: number) =>
		(index / barCount) * availableWidth + paddingX / 2 + barWidth / 2;

	const toY = (value: number) => {
		if (value <= 1) return chartHeight - paddingY;
		const ratio = (Math.log10(value) - logMin) / logSpan;
		return chartHeight - paddingY - ratio * drawHeight;
	};

	const baselineY = chartHeight - paddingY;

	const guides = Array.from({ length: 16 }, (_, i) => i);

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guides */}
			{guides.map((index) => {
				const ratio = index / (guides.length - 1);
				const y = chartHeight - paddingY - drawHeight * ratio;
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

			{/* X-axis guide line */}
			<polyline
				className="stroke-zinc-700"
				fill="none"
				strokeWidth={1}
				points={`${paddingX / 2},${baselineY} ${chartWidth - paddingX / 2},${baselineY}`}
			/>

			{/* Candlesticks: wick (lotMin -> lotMax) + median tick */}
			{data.map((d, index) => {
				const cx = toX(index);
				const yTop = toY(d.lotMax);
				const yBottom = toY(d.lotMin);
				const yMed = toY(d.lotMedian);
				const showLabel = index % 10 === 0 || data.length <= 12;
				const isHot = hovered === index;

				return (
					<g key={d.volume}>
						{/* Wick: lotMin to lotMax */}
						<line
							x1={cx}
							y1={yTop}
							x2={cx}
							y2={yBottom}
							className={isHot ? "stroke-zinc-300" : "stroke-zinc-500"}
							strokeWidth={2}
						/>
						{/* Median tick */}
						<line
							x1={cx - candleWidth / 2}
							y1={yMed}
							x2={cx + candleWidth / 2}
							y2={yMed}
							className={isHot ? "stroke-zinc-100" : "stroke-zinc-300"}
							strokeWidth={2}
						/>

						{/* Invisible hit area spanning the wick height */}
						<rect
							x={cx - barWidth / 2}
							y={Math.min(yTop, yBottom) - 4}
							width={barWidth}
							height={Math.abs(yBottom - yTop) + 8}
							fill="transparent"
							className="cursor-pointer"
							onMouseEnter={() => setHovered(index)}
							onMouseLeave={() => setHovered((h) => (h === index ? null : h))}
						/>

						{/* X-axis label every 10 tiers */}
						{showLabel && (
							<g transform={`translate(${cx} ${chartHeight - (paddingY - offsetY)})`}>
								<text
									transform="rotate(45)"
									textAnchor="start"
									fontSize={10}
									className="fill-zinc-600 select-none"
								>
									{d.volume} {unitLabel}
								</text>
							</g>
						)}
					</g>
				);
			})}

			{/* Single shared hover overlay (tooltip + left-axis legend) */}
			{hovered !== null &&
				(() => {
					const d = data[hovered];
					const cx = toX(hovered);
					const yTop = toY(d.lotMax);
					const yBottom = toY(d.lotMin);
					const yMed = toY(d.lotMedian);
					return (
						<g className="pointer-events-none">
							{/* Hover label (median) */}
							<circle
								className="stroke-zinc-500 fill-black"
								cx={cx}
								cy={yTop - 12}
								r={20}
								strokeWidth={2}
							/>
							<text
								x={cx}
								y={yTop - 9}
								textAnchor="middle"
								fontSize={8}
								className="font-bold fill-zinc-100 select-none"
							>
								{Math.round(d.lotMedian).toLocaleString()}
							</text>

							{/* Left-axis legend: top (max) and min values */}
							<line
								x1={paddingX / 2}
								y1={yTop}
								x2={cx - candleWidth / 2}
								y2={yTop}
								className="stroke-zinc-500"
								strokeWidth={1}
							/>
							<line
								x1={paddingX / 2}
								y1={yBottom}
								x2={cx - candleWidth / 2}
								y2={yBottom}
								className="stroke-zinc-500"
								strokeWidth={1}
							/>
							<circle cx={paddingX / 2} cy={yTop} r={3} className="fill-zinc-300" />
							<circle cx={paddingX / 2} cy={yBottom} r={3} className="fill-zinc-500" />
							<text
								x={paddingX / 2 - 6}
								y={yTop + 3}
								textAnchor="end"
								fontSize={8}
								className="font-bold fill-zinc-100 select-none"
							>
								{Math.round(d.lotMax).toLocaleString()}
							</text>
							<text
								x={paddingX / 2 - 6}
								y={yBottom + 3}
								textAnchor="end"
								fontSize={8}
								className="font-bold fill-zinc-400 select-none"
							>
								{Math.round(d.lotMin).toLocaleString()}
							</text>
							{/* median marker on axis */}
							<text
								x={paddingX / 2 - 6}
								y={yMed + 3}
								textAnchor="end"
								fontSize={8}
								className="font-bold fill-zinc-200 select-none"
							>
								{Math.round(d.lotMedian).toLocaleString()}
							</text>
						</g>
					);
				})()}
		</svg>
	);
};

export default CandlestickChart;
