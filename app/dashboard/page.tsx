import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import getData from "../actions/getData";
import LineChart from "../components/chart";

export const revalidate = 300; // revalidate at most every 5 minutes

export default async function Dashboard() {
	const dataPoints = await getData(288); // 288 data points = last 24 hours (5-min intervals)
	return (
		<>
			<Tabs defaultValue="internet" className="">
				<TabsList>
					<TabsTrigger value="internet">Internet</TabsTrigger>
					<TabsTrigger value="calls">Calls</TabsTrigger>
					<TabsTrigger value="messages">Messages</TabsTrigger>
				</TabsList>
				<TabsContent value="internet">
					<h1 className="text-2xl">Number of 1 GB lots in the last 24 hours</h1>
					<LineChart data={dataPoints} />
				</TabsContent>
				<TabsContent value="calls">calls dashboard</TabsContent>
				<TabsContent value="messages">messages dashboard</TabsContent>
			</Tabs>
		</>
	);
}
