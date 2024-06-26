import React from "react";
type ChartProps = {
	data: {
		date: string;
		numberOfLots: number;
	}[];
};

const LineChart = ({ data }: ChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;
	const maxY = Math.max(...data.map((item) => item.numberOfLots));
	const guides = Array.from({ length: 16 }, (_, index) => index);

	//TODO normalize height (Y)
	const properties = data.map((property, index) => {
		const { numberOfLots, date } = property;
		const x =
			(index / data.length) * (chartWidth - paddingX) + paddingX / 2;
		const y =
			chartHeight -
			offsetY -
			(numberOfLots / maxY) * (chartHeight - (paddingY + offsetY)) -
			paddingY +
			offsetY;
		return {
			total: numberOfLots,
			date: date,
			x: x,
			y: y,
		};
	});

	const points = properties
		.map((point) => {
			const { x, y } = point;
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{guides.map((_, index) => {
				const ratio = index / guides.length;
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

			<polyline
				fill="none"
				className="stroke-zinc-500"
				strokeWidth={2}
				points={points}
			/>

			{properties.map((property, index) => {
				const { total, date, x, y } = property;

				return (
					<g key={index}>
						<circle
							className="stroke-zinc-500 fill-black"
							cx={x}
							cy={y}
							r={12}
							strokeWidth={2}
						/>
						<text
							x={x}
							y={y + 2.8}
							textAnchor="middle"
							fontSize={8}
							className="font-bold fill-zinc-100 select-none"
						>
							{total}
						</text>

						<g
							transform={`translate(${x} ${
								chartHeight - (paddingY - offsetY)
							})`}
						>
							<text
								transform="rotate(45)"
								textAnchor="start"
								// transformOrigin="50% 50%"
								fontSize={10}
								className="fill-zinc-100 select-none"
							>
								{new Date(date).toLocaleDateString(undefined, {
									year: "2-digit",
									month: "numeric",
									day: "numeric",
								})}
							</text>
						</g>
					</g>
				);
			})}
		</svg>
	);
};

export default LineChart;
