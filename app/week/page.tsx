import getData from "../actions/getData";
import LineChart from "../components/chart";

export const revalidate = 300; // revalidate at most every 5 minutes

export default async function Week() {
	const dataPoints = await getData(2016);//288 day, 2016 week
	return (
    <>
			<div className="text-2xl">Weekly graph (messy)</div>
			<LineChart data={dataPoints} />
    </>
	);
}
