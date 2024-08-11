import getData from "../actions/getData";
import LineChart from "../components/chart";

export const revalidate = 300; // revalidate at most every 5 minutes

export default async function Week() {
	const dataPoints = await getData(2016, 0);//288 day, 2016 week
	const filteredDataPoints = await getData(2016, 100000);//288 day, 2016 week
	return (
    <>
			<h1 className="text-2xl">Weekly graph (messy)</h1>
			<LineChart data={dataPoints} />
			<h1 className="text-2xl">Weekly graph (filtered)</h1>
			<LineChart data={filteredDataPoints} />
			<h1 className="text-2xl">Weekly graph (folded)</h1>
			<LineChart data={filteredDataPoints} numberOfLayers={7} />
    </>
	);
}
