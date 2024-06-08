import { createClient } from "@supabase/supabase-js";
//  <saveMarketData:
async function saveMarketData() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	try {
		const { error: dbError } = await supabase
			.from("MarketData")
			.insert([
				{
					status: "OK",
					message: "testData",
					data: `[{ "volume": 1.0, "minCost": 15.0, "avgCost": 16.49, "maxCost": 50.0, "count": 266165 }, { "volume": 2.0, "minCost": 30.0, "avgCost": 32.52, "maxCost": 100.0, "count": 110822 }, { "volume": 3.0, "minCost": 45.0, "avgCost": 47.58, "maxCost": 150.0, "count": 90680 }, { "volume": 4.0, "minCost": 60.0, "avgCost": 65.88, "maxCost": 200.0, "count": 36515 }, { "volume": 5.0, "minCost": 75.0, "avgCost": 81.75, "maxCost": 250.0, "count": 77991 }, { "volume": 6.0, "minCost": 90.0, "avgCost": 96.29, "maxCost": 300.0, "count": 30623 }}]`,
				},
			])
			.select();
		if (dbError) {
			throw dbError;
		}
	} catch (dbError) {
		console.log(dbError);
	} finally {
		console.log("ended server action");
	}
}
export default saveMarketData;
