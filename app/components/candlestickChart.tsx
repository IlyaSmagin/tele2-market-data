import React from "react";

type DataPoint = {
	date: string;
	numberOfLots: number;
};

type CandlestickChartProps = {
	data: DataPoint[];
	bucketCount?: number;
};

type Bucket = {
	rangeMin: number;
	rangeMax: number;
	rangeMid: number;
	lotMin: number;
	lotMax: number;
	lotMedian: number;
	count: number;
};

function computeBuckets(data: DataPoint[], bucketCount: number): Bucket[] {
	if (data.length === 0) return [];

	const lotValues = data.map((d) => d.numberOfLots);
	const globalMin = Math.min(...lotValues);
	const globalMax = Math.max(...lotValues);
	const bucketSize = (globalMax - globalMin) / bucketCount;

	const buckets: Bucket[] = Array.from({ length: bucketCount }, (_, i) => ({
		rangeMin: globalMin + i * bucketSize,
		rangeMax: globalMin + (i + 1) * bucketSize,
		rangeMid: globalMin + (i + 0.5) * bucketSize,
		lotMin: Infinity,
		lotMax: -Infinity,
		lotMedian: 0,
		count: 0,
	}));

	for (const point of data) {
		const idx = Math.min(
			Math.floor((point.numberOfLots - globalMin) / bucketSize),
			bucketCount - 1
		);
		const b = buckets[idx];
		b.count += 1;
		if (point.numberOfLots < b.lotMin) b.lotMin = point.numberOfLots;
		if (point.numberOfLots > b.lotMax) b.lotMax = point.numberOfLots;
	}

	// Compute medians per bucket
	for (let i = 0; i < bucketCount; i++) {
		const b = buckets[i];
		if (b.count === 0) {
			b.lotMin = 0;
			b.lotMax = 0;
			b.lotMedian = 0;
		} else {
			const vals = data
				.filter((d) => {
					const idx = Math.min(
						Math.floor((d.numberOfLots - globalMin) / bucketSize),
						bucketCount - 1
					);
					return idx === i;
				})
				.map((d) => d.numberOfLots)
				.sort((a, z) => a - z);
			const mid = Math.floor(vals.length / 2);
			b.lotMedian =
				vals.length % 2 === 0
					? (vals[mid - 1] + vals[mid]) / 2
					: vals[mid];
		}
	}

	return buckets;
}

const CandlestickChart = ({
	data,
	bucketCount = 12,
}: CandlestickChartProps) => {
	const chartWidth = 1200;
	const chartHeight = 600;
	const offsetY = 40;
	const paddingX = 50;
	const paddingY = 90;

	const buckets = computeBuckets(data, bucketCount);
	const activeBuckets = buckets.filter((b) => b.count > 0);

	if (activeBuckets.length === 0) {
		return (
			<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation" />
		);
	}

	// Y-axis: numberOfLots (vertical)
	const allLotValues = activeBuckets.flatMap((b) => [b.lotMin, b.lotMax]);
	const yMin = Math.min(...allLotValues);
	const yMax = Math.max(...allLotValues);

	// X-axis: volume range midpoints
	const xMin = Math.min(...buckets.map((b) => b.rangeMin));
	const xMax = Math.max(...buckets.map((b) => b.rangeMax));

	const toX = (value: number) =>
		((value - xMin) / (xMax - xMin)) * (chartWidth - paddingX) + paddingX / 2;

	const toY = (value: number) =>
		chartHeight -
		paddingY -
		((value - yMin) / (yMax - yMin)) * (chartHeight - paddingY - offsetY);

	const guides = Array.from({ length: 16 }, (_, i) => i);
	const candleWidth = Math.max(
		4,
		((chartWidth - paddingX) / bucketCount) * 0.45
	);

	return (
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="presentation">
			{/* Guides */}
			{guides.map((index) => {
				const ratio = index / (guides.length - 1);
				const y = chartHeight - paddingY - (chartHeight - paddingY - offsetY) * ratio;
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
				points={`${paddingX / 2},${toY(yMin)} ${chartWidth - paddingX / 2},${toY(yMin)}`}
			/>

			{/* Candlesticks */}
			{buckets.map((bucket, i) => {
				if (bucket.count === 0) return null;

				const cx = toX(bucket.rangeMid);
				const yTop = toY(bucket.lotMax);
				const yBottom = toY(bucket.lotMin);
				const yMed = toY(bucket.lotMedian);

				const bodyTop = Math.min(yMed, yTop);
				const bodyBottom = Math.max(yMed, yBottom);
				const bodyHeight = Math.max(1, bodyBottom - bodyTop);

				return (
					<g key={i} className="opacity-80 hover:opacity-100">
						{/* Full wick: min to max */}
						<line
							x1={cx}
							y1={yTop}
							x2={cx}
							y2={yBottom}
							className="stroke-zinc-500"
							strokeWidth={2}
						/>
						{/* Body: median to max */}
						<rect
							x={cx - candleWidth / 2}
							y={bodyTop}
							width={candleWidth}
							height={bodyHeight}
							className="fill-zinc-600 stroke-zinc-500"
							strokeWidth={1}
						/>
						{/* Median tick */}
						<line
							x1={cx - candleWidth / 2}
							y1={yMed}
							x2={cx + candleWidth / 2}
							y2={yMed}
							className="stroke-zinc-300"
							strokeWidth={2}
						/>

						{/* Hover label group */}
						<g className="opacity-0 hover:opacity-100">
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
								{bucket.lotMax}
							</text>
						</g>

						{/* X-axis label: volume range */}
						<g transform={`translate(${cx} ${chartHeight - (paddingY - offsetY)})`}>
							<text
								transform="rotate(45)"
								textAnchor="start"
								fontSize={10}
								className="fill-zinc-600 select-none"
							>
								{Math.round(bucket.rangeMin / 1000)}k–{Math.round(bucket.rangeMax / 1000)}k
							</text>
						</g>
					</g>
				);
			})}
		</svg>
	);
};

export default CandlestickChart;
