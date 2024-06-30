import getData from "./actions/getData";
import saveMarketData from "./actions/saveMarketData";
import LineChart from "./components/chart";

export default async function Home() {
	const dataPoints = await getData(50);
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="text-4xl">Text</div>
			<LineChart data={dataPoints} />
			<form action={saveMarketData}>
				<button type="submit">Save data to db</button>
			</form>
		</main>
	);
}
