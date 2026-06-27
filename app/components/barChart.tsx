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

	const guides = Array.from({ length: 16 }, (_, i) => i);

	const maxY = Math.max(...data);
	const minY = 0;

	const barCount = data.length;
	const availableWidth = chartWidth - paddingX;
	const barWidth = availableWidth / barCount;
	const barBodyWidth = Math.max(1, barWidth * 0.7);

	const toX = (index: number) =>
		(index / barCount) * availableWidth + paddingX / 2 + barWidth / 2;

	const toY = (value: number) =>
		chartHeight -
		paddingY -
		((value - minY) / (maxY - minY)) * (chartHeight - paddingY - offsetY);

	const baselineY = toY(minY);

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guides */}
			{guides.map((index) => {
				const ratio = index / (guides.length - 1);
				const y =
					chartHeight -
					paddingY -
					(chartHeight - paddingY - offsetY) * ratio;
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
