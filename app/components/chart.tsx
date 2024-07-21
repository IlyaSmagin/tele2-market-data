import React from "react";
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
	//TODO remove destructing array twice
	const maxY = Math.max(...data.map((item) => item.numberOfLots));
	const minY = Math.min(...data.map((item) => item.numberOfLots));
	//TODO easier guides array creation
	const guides = Array.from({ length: 16 }, (_, index) => index);

	const properties = data.map((property, index) => {
		const { numberOfLots, date } = property;
		const relativeLotsCount = numberOfLots - minY;
		const x =
		(index%(data.length/numberOfLayers) / (data.length/numberOfLayers)) * (chartWidth - paddingX) + paddingX / 2;
		//TODO extract logical computation into separate variables
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

	const points = properties
		.map((point) => {
			const { x, y } = point;
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">

			{/*Guides TODO: move .map out of return, then extract to separate component*/}
			{guides.map((_, index) => {
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

			{/*Main line TODO: split into numberOfLayers lines with different colors*/}
			<polyline
				fill="none"
				className="stroke-zinc-500"
				strokeWidth={2}
				points={points}
			/>

			{/*Labels*/}
			{properties.map((property, index) => {
				const { total, date, x, y } = property;

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
							{total}
						</text>

						<g
							transform={`translate(${x} ${
								chartHeight - (paddingY - offsetY)
							})`}
						>
							{/* transformOrigin="50% 50%"*/}
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

export default LineChart;
