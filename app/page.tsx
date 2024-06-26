import saveMarketData from "./actions/saveMarketData";
import LineChart from "./components/chart";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="text-4xl">Text</div>
			<LineChart
				data={[
					{
						date: "Sun Jan 02 2022 00:00:00 GMT+0000 (Greenwich Mean Time)",
						numberOfLots: 1242,
					},
					{
						date: "Sun Jan 02 2022 01:00:00 GMT+0000 (Greenwich Mean Time)",
						numberOfLots: 1011,
					},
				]}
			/>
			<form action={saveMarketData}>
				<button type="submit">Save data to db</button>
			</form>
		</main>
	);
}
