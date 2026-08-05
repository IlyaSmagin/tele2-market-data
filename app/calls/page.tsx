import getCallsData from "../actions/getCallsData";
import getLatestCallsDistribution from "../actions/getLatestCallsDistribution";
import { parseRangeParams } from "@/lib/range";
import { interpolateWeek, splitIntoSegments } from "@/lib/interpolate";
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
	const dataPoints = interpolateWeek(await getCallsData(2500, 0));
	const filteredDataPoints = interpolateWeek(await getCallsData(2500, 100000));
	const dataSegments = splitIntoSegments(dataPoints);
	const filteredSegments = splitIntoSegments(filteredDataPoints);
	const selection = parseRangeParams(searchParams, 50, 2500);
	const volumeDistributionData = await getLatestCallsDistribution(selection);
	const fullVolumeDistribution = await getLatestCallsDistribution();

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<section>
				<h1 className="text-2xl mb-2">Lots distribution by volume range</h1>
				<RangePicker selection={selection} unitLabel="min" volumeMin={50} volumeMax={2500} />
				<CandlestickChart data={volumeDistributionData} unitLabel="min" />
			</section>
			<section>
				<h1 className="text-2xl mb-2">Volume distribution (lots per min tier)</h1>
				<BarChart data={fullVolumeDistribution.map((d) => d.count)} unitLabel="min" volumeLabels={fullVolumeDistribution.map((d) => d.volume)} />
			</section>
			<section>
				<h1 className="text-2xl mb-2">Weekly graph (filtered)</h1>
				<LineChart data={filteredDataPoints} />
			</section>
			<section>
				<h1 className="text-2xl mb-2">Weekly graph (folded)</h1>
				<LineChart segments={filteredSegments} />
			</section>
			<section>
				<h1 className="text-2xl mb-2">Rate of change of 1 min lots (folded by day)</h1>
				<DerivativeChart segments={dataSegments} />
			</section>
		</div>
	);
}
