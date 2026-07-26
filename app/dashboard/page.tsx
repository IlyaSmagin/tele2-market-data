import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getData from "../actions/getData";
import getCallsData from "../actions/getCallsData";
import getCallsStats from "../actions/getCallsStats";
import getMarketStats from "../actions/getMarketStats";
import LineChart from "../components/chart";
import DerivativeChart from "../components/derivativeChart";
import StatCard from "../components/statCard";
import { interpolateWeek, splitIntoSegments } from "@/lib/interpolate";

type LotPoint = { date: string; numberOfLots: number };

// Points per day at the 5-minute cadence (288 = 24h).
const POINTS_PER_DAY = 288;

function pctDelta(now: number, before: number): number {
	if (!before) return 0;
	return ((now - before) / before) * 100;
}

// Builds the analytics cards (internet lots + calls lots) for a time window.
// `baselineDays` is how far back the "comparison" point sits (1 = yesterday,
// 7 = same time last week, 30 = same time last month).
function MarketCards({
	series,
	totalLotsNow,
	totalLotsBaseline,
	baselineDays,
	caption,
	callsSeries,
	callsTotalNow,
	callsTotalBaseline,
}: {
	series: LotPoint[];
	totalLotsNow: number;
	totalLotsBaseline: number;
	baselineDays: number;
	caption: string;
	callsSeries: LotPoint[];
	callsTotalNow: number;
	callsTotalBaseline: number;
}) {
	const oneGbNow = series.length ? series[series.length - 1].numberOfLots : 0;
	const oneGbBefore = series.length
		? series[Math.max(0, series.length - 1 - baselineDays * POINTS_PER_DAY)]
				.numberOfLots
		: 0;

	const fiftyMinNow = callsSeries.length ? callsSeries[callsSeries.length - 1].numberOfLots : 0;
	const fiftyMinBefore = callsSeries.length
		? callsSeries[Math.max(0, callsSeries.length - 1 - baselineDays * POINTS_PER_DAY)]
				.numberOfLots
		: 0;

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<StatCard
				label="Total internet lots on market"
				value={totalLotsNow}
				deltaPct={pctDelta(totalLotsNow, totalLotsBaseline)}
				deltaCaption={caption}
			/>
			<StatCard
				label="1 GB internet lots"
				value={oneGbNow}
				deltaPct={pctDelta(oneGbNow, oneGbBefore)}
				deltaCaption={caption}
			/>
			<StatCard
				label="Total call lots on market"
				value={callsTotalNow}
				deltaPct={pctDelta(callsTotalNow, callsTotalBaseline)}
				deltaCaption={caption}
			/>
			<StatCard
				label="50 min lots"
				value={fiftyMinNow}
				deltaPct={pctDelta(fiftyMinNow, fiftyMinBefore)}
				deltaCaption={caption}
			/>
		</div>
	);
}

export const revalidate = 300; // revalidate at most every 5 minutes

type LotData = { date: string; numberOfLots: number }[];

// Bundle of every dataset a graph might need, keyed by time range.
type DataBundle = {
	day: LotData;
	week: LotData;
	weekSegments: LotData[];
	callsDay: LotData;
};

// Registry of every available graph. To add a new graph, add an entry here
// and then reference its id in one or more tabs below.
type GraphDefinition = {
	id: string;
	title: string;
	render: (data: DataBundle) => React.ReactNode;
};

const GRAPH_REGISTRY: Record<string, GraphDefinition> = {
	"1gb-24h": {
		id: "1gb-24h",
		title: "Number of 1 GB lots in the last 24 hours",
		render: (data) => <LineChart data={data.day} />,
	},
	"1gb-week-folded": {
		id: "1gb-week-folded",
		title: "1 GB lots over the week (folded by day)",
		render: (data) => <LineChart segments={data.weekSegments} />,
	},
	"1gb-derivative-24h": {
		id: "1gb-derivative-24h",
		title: "Rate of change of 1 GB lots (last 24 hours)",
		render: (data) => <DerivativeChart data={data.day} />,
	},
	"1gb-derivative-week-folded": {
		id: "1gb-derivative-week-folded",
		title: "Rate of change of 1 GB lots over the week (folded by day)",
		render: (data) => <DerivativeChart segments={data.weekSegments} />,
	},
	"calls-50-24h": {
		id: "calls-50-24h",
		title: "Number of 50 min lots in the last 24 hours",
		render: (data) => <LineChart data={data.callsDay} />,
	},
	"calls-50-derivative-24h": {
		id: "calls-50-derivative-24h",
		title: "Rate of change of 50 min lots (last 24 hours)",
		render: (data) => <DerivativeChart data={data.callsDay} />,
	},
};

// Tab configuration. Each tab lists graph ids in display order — reorder the
// array to rearrange graphs, or add ids from the registry to include more.
// `baselineDays` sets how far back the card comparison point sits, and
// `baselineKey` picks the matching total-lots snapshot from getMarketStats.
type TabConfig = {
	value: string;
	label: string;
	graphs: string[];
	baselineDays: number;
	caption: string;
	baselineKey: "totalLots1d" | "totalLots7d" | "totalLots30d";
};

const TABS: TabConfig[] = [
	{
		value: "24h",
		label: "24h",
		graphs: ["1gb-24h", "1gb-derivative-24h", "calls-50-24h", "calls-50-derivative-24h"],
		baselineDays: 1,
		caption: "vs yesterday",
		baselineKey: "totalLots1d",
	},
	{
		value: "week",
		label: "Week",
		graphs: ["1gb-week-folded", "1gb-derivative-week-folded"],
		baselineDays: 7,
		caption: "vs last week",
		baselineKey: "totalLots7d",
	},
];

export default async function Dashboard() {
	// 288 points = 24h, 2016 = week
	const [day, weekData, stats, callsDay, callsStats] = await Promise.all([
		getData(288),
		getData(2500),
		getMarketStats(),
		getCallsData(288, 0, 50),
		getCallsStats(),
	]);
	const week = interpolateWeek(weekData);
	const weekSegments = splitIntoSegments(week);
	const data: DataBundle = { day, week, weekSegments, callsDay };

	// Map each tab to the series key used in the DataBundle.
	const tabSeries: Record<string, LotPoint[]> = {
		"24h": day,
		week: week,
	};

	return (
		<Tabs defaultValue={TABS[0].value}>
			<TabsList>
				{TABS.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>

			{TABS.map((tab) => (
				<TabsContent key={tab.value} value={tab.value} className="flex flex-col gap-6">
					<MarketCards
						series={tabSeries[tab.value] ?? []}
						totalLotsNow={stats.totalLotsNow}
						totalLotsBaseline={stats[tab.baselineKey]}
						baselineDays={tab.baselineDays}
						caption={tab.caption}
						callsSeries={callsDay}
						callsTotalNow={callsStats.totalLotsNow}
						callsTotalBaseline={callsStats[tab.baselineKey]}
					/>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{tab.graphs.map((graphId) => {
							const graph = GRAPH_REGISTRY[graphId];
							if (!graph) return null;
							return (
								<section key={graph.id}>
									<h1 className="text-2xl mb-2">{graph.title}</h1>
									{graph.render(data)}
								</section>
							);
						})}
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
