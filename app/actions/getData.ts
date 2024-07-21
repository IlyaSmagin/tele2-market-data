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
		.gt('1Gb', '100000')//filter falsy datapoints TODO: change outliers to last correct value or query API again
		.order("id", { ascending: false })
		.limit(data_length);//limit is set to 2016 rows TODO: check db to only keep data from every 5 minutes
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
		}).reverse();// TODO: REWRITE!
	return graphData;
}
export default getData;
