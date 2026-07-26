import getCallsData from "../actions/getCallsData";
import getLatestCallsDistribution from "../actions/getLatestCallsDistribution";
import { parseRangeParams } from "@/lib/range";
import { alignToDrop } from "@/lib/align";
import LineChart from "../components/chart";
import CandlestickChart from "../components/candlestickChart";
import BarChart from "../components/barChart";
import DerivativeChart from "../components/derivativeChart";
import RangePicker from "../components/rangePicker";

export const revalidate = 300;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function CallsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const dataPoints = await getCallsData(2016, 0);
	const filteredDataPoints = await getCallsData(2016, 100000);
	const selection = parseRangeParams(searchParams, 50, 2500);
	const volumeDistributionData = await getLatestCallsDistribution(selection);
	const fullVolumeDistribution = await getLatestCallsDistribution();

	return (
		<>
			<h1 className="text-2xl">Weekly graph (messy)</h1>
			<LineChart data={dataPoints} />
			<h1 className="text-2xl">Lots distribution by volume range</h1>
			<RangePicker selection={selection} unitLabel="min" volumeMin={50} volumeMax={2500} />
			<CandlestickChart data={volumeDistributionData} unitLabel="min" />
			<h1 className="text-2xl">Volume distribution (lots per min tier)</h1>
			<BarChart data={fullVolumeDistribution.map((d) => d.count)} unitLabel="min" volumeLabels={fullVolumeDistribution.map((d) => d.volume)} />
			<h1 className="text-2xl">Weekly graph (filtered)</h1>
			<LineChart data={filteredDataPoints} />
			<h1 className="text-2xl">Weekly graph (folded)</h1>
			<LineChart data={alignToDrop(filteredDataPoints)} numberOfLayers={7} />
			<h1 className="text-2xl">Rate of change of 1 min lots (weekly)</h1>
			<DerivativeChart data={dataPoints} />
			<h1 className="text-2xl">Rate of change of 1 min lots (folded by day)</h1>
			<DerivativeChart data={alignToDrop(dataPoints)} numberOfLayers={7} />
		</>
	);
}
