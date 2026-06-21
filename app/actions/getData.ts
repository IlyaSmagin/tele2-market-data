// import { Data } from "@/types";
import { createClient } from "@supabase/supabase-js";
//  <song:Promise<Podcast[]>>

// Dummy data placeholder for when Supabase returns nothing
function generateDummyData(data_length: number): { date: string; numberOfLots: number }[] {
	const now = new Date();
	const dummyData = [];
	
	for (let i = data_length - 1; i >= 0; i--) {
		const date = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
		const baseValue = 150000 + Math.sin(i / 20) * 50000;
		const noise = Math.random() * 20000 - 10000;
		
		dummyData.push({
			date: date.toISOString(),
			numberOfLots: Math.max(100000, Math.round(baseValue + noise)),
		});
	}
	
	return dummyData;
}

async function getData(data_length: number, treshhold = 100000) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { data, error } = await supabase
		.from("MarketData")
		.select("created_at, 1Gb")
		.gt('1Gb', `${treshhold}`)//filter falsy datapoints TODO: change outliers to last correct value or query API again
		.order("id", { ascending: false })
		.limit(data_length);//limit is set to 2016 rows TODO: check db to only keep data from every 5 minutes
	
	if (error) {
		console.log("Supabase error:", error);
		console.log("Using dummy data placeholder");
		return generateDummyData(data_length);
	}
	
	// If no data returned from Supabase, use dummy data
	if (!data || data.length === 0) {
		console.log("No data returned from Supabase, using dummy data placeholder");
		return generateDummyData(data_length);
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
