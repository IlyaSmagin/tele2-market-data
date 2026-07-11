import getData from "../actions/getData";
import getLatestVolumeDistribution from "../actions/getLatestVolumeDistribution";
import LineChart from "../components/chart";
import CandlestickChart from "../components/candlestickChart";
import BarChart from "../components/barChart";
import DerivativeChart from "../components/derivativeChart";

export const revalidate = 300; // revalidate at most every 5 minutes

export default async function Week() {
	const dataPoints = await getData(2016, 0);
	const filteredDataPoints = await getData(2016, 100000);
	const volumeDistributionData = await getLatestVolumeDistribution();
	const candlestickData = volumeDistributionData.map((count) => ({
		date: "",
		numberOfLots: count,
	}));
	return (
    <>
			<h1 className="text-2xl">Weekly graph (messy)</h1>
			<LineChart data={dataPoints} />
			<h1 className="text-2xl">Lots distribution by volume range</h1>
			<CandlestickChart data={candlestickData} bucketCount={120} />
			<h1 className="text-2xl">Volume distribution (lots per GB tier)</h1>
			<BarChart data={volumeDistributionData} />
			<h1 className="text-2xl">Weekly graph (filtered)</h1>
			<LineChart data={filteredDataPoints} />
			<h1 className="text-2xl">Weekly graph (folded)</h1>
			<LineChart data={filteredDataPoints} numberOfLayers={7} />
			<h1 className="text-2xl">Rate of change of 1 GB lots (24h)</h1>
			<DerivativeChart data={dataPoints} />
    </>
	);
}
