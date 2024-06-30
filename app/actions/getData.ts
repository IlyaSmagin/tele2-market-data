// import { Data } from "@/types";
import { createClient } from "@supabase/supabase-js";
//  <song:Promise<Podcast[]>>
async function getData(data_length: number) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { data, error } = await supabase
		.from("MarketData")
		.select("created_at,data")
		.range(0, data_length);
	if (error) {
		console.log(error);
	}
	const newData =
		(data as {
			created_at: string;
			data: { volume: number; count: number }[];
		}[]) || {};
	const graphData = newData.map((dataPoint) => {
		return {
			date: dataPoint.created_at,
			numberOfLots: dataPoint.data[0].count,
		};
	});
	// (data as {
	// 	created_at: string;
	// 	data: { volume: number; count: number }[];
	// }[]) || {}
	return graphData;
}
export default getData;
