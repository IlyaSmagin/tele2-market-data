import getData from "./actions/getData";
import saveMarketData from "./actions/saveMarketData";
import LineChart from "./components/chart";

export const revalidate = 300; // revalidate at most every 5 minutes

export default async function Home() {
	const dataPoints = await getData(288);//288 day, 2016 week
	return (
		<main className="flex min-h-screen flex-col items-center justify-between px-24 pt-8">
			<div className="text-4xl">Tele2 market graph</div>
			<LineChart data={dataPoints} />
			<form action={saveMarketData}>
				<button type="submit">Save data to db</button>
			</form>
		</main>
	);
}
