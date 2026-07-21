"use server";
import { createClient } from "@supabase/supabase-js";

const FETCH_HEADERS = {
	Accept: "application/json, text/plain, */*",
	"User-Agent": "okhttp/4.2.0",
	"Tele2-User-Agent":
		'"mytele2-app/4.14.0"; "unknown"; "Android/11"; "Build/164755374"',
	"X-API-Version": "1",
};

async function fetchTrafficData(trafficType: string) {
	try {
		const res = await fetch(
			`https://api.t2.ru/api/exchange/lots/stats/volumes?trafficType=${trafficType}`,
			{ headers: FETCH_HEADERS }
		);

		if (!res.ok) {
			const text = await res.text();
			let detail: string;
			try {
				const errBody = JSON.parse(text);
				detail = errBody.message ?? errBody.error ?? text;
			} catch {
				detail = text || res.statusText;
			}
			console.error(`fetchTrafficData(${trafficType}) ${res.status}: ${detail}`);
			return null;
		}

		const body = await res.json();
		return body as { meta: { status: string; message: string }; data: any[] };
	} catch (e) {
		console.error(`fetchTrafficData(${trafficType}) failed:`, e);
		return null;
	}
}

async function insertSnapshot(
	supabase: any,
	apiData: any[],
	marketDataId: number,
	tableName: string
) {
	const rows = apiData.map((tier: any) => ({
		market_data_id: marketDataId,
		volume: tier.volume,
		min_cost: tier.minCost,
		avg_cost: tier.avgCost,
		max_cost: tier.maxCost,
		count: tier.count,
	}));
	const { error } = await supabase.from(tableName).insert(rows);
	if (error) console.error(tableName, " error:", error);
}

async function saveMarketData() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const [internetResult, callsResult] = await Promise.all([
		fetchTrafficData("data"),
		fetchTrafficData("voice"),
	]);

	const meta = internetResult?.meta ?? callsResult?.meta ?? {
		status: "error",
		message: "both internet and calls fetches failed",
	};

	const { data: inserted, error: dbError } = await supabase
		.from("MarketData")
		.insert([{ status: meta.status, message: meta.message }])
		.select();

	if (dbError || !inserted) {
		console.error("MarketData insert error:", dbError);
		return null;
	}

	const marketDataId = inserted[0].id;

	await Promise.all([
		internetResult
			? insertSnapshot(supabase, internetResult.data, marketDataId, "volume_tiers")
			: Promise.resolve(),
		callsResult
			? insertSnapshot(supabase, callsResult.data, marketDataId, "calls")
			: Promise.resolve(),
	]);

	console.log("Server action: saveMarketData, status: OK");
	return { status: meta.status, message: meta.message };
}

export default saveMarketData;
