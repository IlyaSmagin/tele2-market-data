import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getData from "../actions/getData";
import getLatestVolumeDistribution from "../actions/getLatestVolumeDistribution";
import LineChart from "../components/chart";
import DerivativeChart from "../components/derivativeChart";
import TreeChart from "../components/treeChart";

export const revalidate = 300; // revalidate at most every 5 minutes

type LotData = { date: string; numberOfLots: number }[];

// Bundle of every dataset a graph might need, keyed by time range.
type DataBundle = {
	day: LotData;
	week: LotData;
	month: LotData;
	volumeDistribution: number[];
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
		render: (data) => <LineChart data={data.week} numberOfLayers={7} />,
	},
	"1gb-month-folded": {
		id: "1gb-month-folded",
		title: "1 GB lots over the month (folded by day)",
		render: (data) => <LineChart data={data.month} numberOfLayers={30} />,
	},
	"1gb-derivative-24h": {
		id: "1gb-derivative-24h",
		title: "Rate of change of 1 GB lots (last 24 hours)",
		render: (data) => <DerivativeChart data={data.day} />,
	},
	"1gb-derivative-week-folded": {
		id: "1gb-derivative-week-folded",
		title: "Rate of change of 1 GB lots over the week (folded by day)",
		render: (data) => <DerivativeChart data={data.week} numberOfLayers={7} />,
	},
	"1gb-derivative-month-folded": {
		id: "1gb-derivative-month-folded",
		title: "Rate of change of 1 GB lots over the month (folded by day)",
		render: (data) => <DerivativeChart data={data.month} numberOfLayers={30} />,
	},
	"volume-distribution-tree": {
		id: "volume-distribution-tree",
		title: "Market volume distribution by GB tier",
		render: (data) => <TreeChart data={data.volumeDistribution} />,
	},
};

// Tab configuration. Each tab lists graph ids in display order — reorder the
// array to rearrange graphs, or add ids from the registry to include more.
const TABS: { value: string; label: string; graphs: string[] }[] = [
	{
		value: "24h",
		label: "24h",
		graphs: ["1gb-24h", "1gb-derivative-24h", "volume-distribution-tree"],
	},
	{ value: "week", label: "Week", graphs: ["1gb-week-folded", "1gb-derivative-week-folded"] },
	{ value: "month", label: "Month", graphs: ["1gb-month-folded", "1gb-derivative-month-folded"] },
];

export default async function Dashboard() {
	// 288 points = 24h, 2016 = week, 8640 = month (5-min intervals)
	const [day, week, month, volumeDistribution] = await Promise.all([
		getData(288),
		getData(2016),
		getData(8640),
		getLatestVolumeDistribution(),
	]);
	const data: DataBundle = { day, week, month, volumeDistribution };

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
					{tab.graphs.map((graphId) => {
						const graph = GRAPH_REGISTRY[graphId];
						if (!graph) return null;
						return (
							<section key={graph.id}>
								<h1 className="text-2xl">{graph.title}</h1>
								{graph.render(data)}
							</section>
						);
					})}
				</TabsContent>
			))}
		</Tabs>
	);
}
