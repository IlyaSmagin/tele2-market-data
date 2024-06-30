"use server";
import { createClient } from "@supabase/supabase-js";
//  <saveMarketData:
async function saveMarketData() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const dataPointAPI = await fetch(
		"https://karelia.tele2.ru/api/exchange/lots/stats/volumes?trafficType=data"
	);
	const parsedDataPointAPI = await dataPointAPI.json();
	const { meta, data } = await parsedDataPointAPI;
	try {
		const { error: dbError } = await supabase
			.from("MarketData")
			.insert([
				{
					status: meta.status,
					message: meta.message,
					data: data,
				},
			])
			.select();
		if (dbError) {
			throw dbError;
		}
	} catch (dbError) {
		console.log(dbError);
	} finally {
		console.log("Server action: saveMarketData, status: OK");
	}
}
export default saveMarketData;
