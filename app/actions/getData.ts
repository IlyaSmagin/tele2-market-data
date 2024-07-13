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
		.select("created_at, 1Gb")
		.order("created_at", { ascending: false })
		.limit(data_length);//supabase has internal nimit of 1000 TODO set it to week range (2014)
	if (error) {
		console.log(error);
	}
	//TODO write dedicated type
	const newData =
		(data as {
			"created_at": string;
			"1Gb": number;
		}[]) || {};
	const graphData = newData
		.map((dataPoint) => {
			return {
				date: dataPoint.created_at,
				numberOfLots: dataPoint["1Gb"],
			};
		})
		.reverse();
	return graphData;
}
export default getData;
