import React from "react";

type BarChartProps = {
	data: number[];
};

const BarChart = ({ data }: BarChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	const maxY = Math.max(...data);
	// Log scale: use 1 as minimum so log(0) is avoided
	const logMin = 0;
	const logMax = Math.log10(maxY);

	// Build guide lines at each power of 10 that falls within range
	const powers: number[] = [];
	for (let p = 0; p <= Math.ceil(logMax); p++) {
		powers.push(p);
	}

	const drawHeight = chartHeight - paddingY - offsetY;

	const barCount = data.length;
	const availableWidth = chartWidth - paddingX;
	const barWidth = availableWidth / barCount;
	const barBodyWidth = Math.max(1, barWidth * 0.7);

	const toX = (index: number) =>
		(index / barCount) * availableWidth + paddingX / 2 + barWidth / 2;

	// Map a value onto the SVG Y axis using log10 scale; values < 1 are clamped to baseline
	const toY = (value: number) => {
		if (value <= 1) return chartHeight - paddingY;
		const ratio = (Math.log10(value) - logMin) / (logMax - logMin);
		return chartHeight - paddingY - ratio * drawHeight;
	};

	const baselineY = chartHeight - paddingY;

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guides at each power of 10 */}
			{powers.map((p) => {
				const value = Math.pow(10, p);
				const y = toY(value);
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
							{value >= 1000000
								? `${value / 1000000}M`
								: value >= 1000
								? `${value / 1000}K`
								: value}
						</text>
					</g>
				);
			})}

			{/* Bars */}
			{data.map((value, index) => {
				const cx = toX(index);
				const barTop = toY(value);
				const barHeight = Math.max(1, baselineY - barTop);

				// X-axis label: every 10th bar
				const showLabel = index % 10 === 0;

				return (
					<g key={index} className="group">
						{/* Default bar */}
						<rect
							x={cx - barBodyWidth / 2}
							y={barTop}
							width={barBodyWidth}
							height={barHeight}
							className="fill-zinc-700 stroke-zinc-600 group-hover:fill-zinc-400 transition-colors"
							strokeWidth={1}
						/>

						{/* Hover label */}
						<g className="opacity-0 group-hover:opacity-100">
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

						{/* X-axis label every 10 bars */}
						{showLabel && (
							<g transform={`translate(${cx} ${chartHeight - (paddingY - offsetY)})`}>
								<text
									transform="rotate(45)"
									textAnchor="start"
									fontSize={10}
									className="fill-zinc-600 select-none"
								>
									{index + 1} GB
								</text>
							</g>
						)}
					</g>
				);
			})}
		</svg>
	);
};

export default BarChart;
