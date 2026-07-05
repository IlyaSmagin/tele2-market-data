import React from "react";

type DerivativeChartProps = {
	numberOfLayers?: number;
	data: {
		date: string;
		numberOfLots: number;
	}[];
};

// Shows the rate of change (derivative) of the number of 1 GB lots between
// consecutive data points. Positive values mean lots are being added to the
// market, negative values mean they are being sold/removed.
const DerivativeChart = ({ data, numberOfLayers = 1 }: DerivativeChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	// Compute the derivative: difference between each point and the previous one.
	// First point has no predecessor, so its rate of change is 0.
	const derivative = data.map((point, index) => {
		const previous = index === 0 ? point.numberOfLots : data[index - 1].numberOfLots;
		return {
			date: point.date,
			delta: point.numberOfLots - previous,
		};
	});

	const maxY = Math.max(...derivative.map((item) => item.delta));
	const minY = Math.min(...derivative.map((item) => item.delta));
	// Symmetric range around zero so the zero line sits sensibly in the chart.
	const range = maxY - minY || 1;

	const guides = Array.from({ length: 16 }, (_, i) => i);
	const layers = Array.from({ length: numberOfLayers }, (_, i) => i);

	const toY = (delta: number) =>
		chartHeight -
		((delta - minY) / range) * (chartHeight - (paddingY + offsetY)) -
		paddingY;

	const properties = derivative.map((property, index) => {
		const { delta, date } = property;
		const x =
			((index % (derivative.length / numberOfLayers)) /
				(derivative.length / numberOfLayers)) *
				(chartWidth - paddingX) +
			paddingX / 2;
		return {
			delta,
			date,
			x,
			y: toY(delta),
		};
	});

	const points = properties.map((point) => `${point.x},${point.y}`);

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
			{layers.map((layer) => (
				<polyline
					fill="none"
					className="stroke-zinc-600"
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
			))}

			{/* Labels */}
			{properties.map((property, index) => {
				const { delta, date, x, y } = property;
				return (
					<g key={index} className="opacity-0 hover:opacity-100">
						<circle
							className="stroke-zinc-500 fill-black"
							cx={x}
							cy={y}
							r={20}
							strokeWidth={2}
						/>
						<text
							x={x}
							y={y + 2.8}
							textAnchor="middle"
							fontSize={8}
							className="font-bold fill-zinc-100 select-none"
						>
							{delta > 0 ? `+${delta}` : delta}
						</text>

						<g transform={`translate(${x} ${chartHeight - (paddingY - offsetY)})`}>
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
			})}
		</svg>
	);
};

export default DerivativeChart;
