import getData from "../actions/getData";
import getLatestVolumeDistribution from "../actions/getLatestVolumeDistribution";
import { parseRangeParams } from "@/lib/range";
import { alignToDrop } from "@/lib/align";
import LineChart from "../components/chart";
import CandlestickChart from "../components/candlestickChart";
import BarChart from "../components/barChart";
import DerivativeChart from "../components/derivativeChart";
import RangePicker from "../components/rangePicker";

export const revalidate = 300; // revalidate at most every 5 minutes

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Week({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const dataPoints = await getData(2016, 0);
	const filteredDataPoints = await getData(2016, 100000);
	const selection = parseRangeParams(searchParams);
	const volumeDistributionData = await getLatestVolumeDistribution(selection);
	// Bar chart is independent of the range picker — always show the full set.
	const fullVolumeDistribution = await getLatestVolumeDistribution();

	return (
    <>
			<h1 className="text-2xl">Weekly graph (messy)</h1>
			<LineChart data={dataPoints} />
			<h1 className="text-2xl">Lots distribution by volume range</h1>
			<RangePicker selection={selection} />
			<CandlestickChart data={volumeDistributionData} />
			<h1 className="text-2xl">Volume distribution (lots per GB tier)</h1>
			<BarChart data={fullVolumeDistribution.map((d) => d.count)} volumeLabels={fullVolumeDistribution.map((d) => d.volume)} />
			<h1 className="text-2xl">Weekly graph (filtered)</h1>
			<LineChart data={filteredDataPoints} />
			<h1 className="text-2xl">Weekly graph (folded)</h1>
			<LineChart data={alignToDrop(filteredDataPoints)} numberOfLayers={7} />
			<h1 className="text-2xl">Rate of change of 1 GB lots (weekly)</h1>
			<DerivativeChart data={dataPoints} />
			<h1 className="text-2xl">Rate of change of 1 GB lots (folded by day)</h1>
			<DerivativeChart data={alignToDrop(dataPoints)} numberOfLayers={7} />
    </>
	);
}
