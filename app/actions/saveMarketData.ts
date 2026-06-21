"use server";
import { createClient } from "@supabase/supabase-js";
//  <saveMarketData:
async function saveMarketData() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const dataPointAPI = await fetch(
		"https://api.t2.ru/api/exchange/lots/stats/volumes?trafficType=data",
		{
			headers: {
				Accept: "application/json, text/plain, */*",
				"User-Agent": "okhttp/4.2.0",
				"Tele2-User-Agent":
					'"mytele2-app/4.14.0"; "unknown"; "Android/11"; "Build/164755374"',
				"X-API-Version": "1",
			},
		},
	);
	const { meta, data } = await dataPointAPI.json();
	const dbObject = {
		status: meta.status,
		message: meta.message,
		data: data,
		"1Gb": data[0].count
	};
	try {
		const { error: dbError } = await supabase
			.from("MarketData")
			.insert([dbObject])
			.select();
		if (dbError) {
			throw dbError;
		}
	} catch (dbError) {
		console.log(dbError);
	} finally {
		console.log("Server action: saveMarketData, status: OK");
		return dbObject;
	}
}
export default saveMarketData;
