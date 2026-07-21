import { createClient } from "@supabase/supabase-js";

function generateDummyData(data_length: number): { date: string; numberOfLots: number }[] {
	const now = new Date();
	const dummyData = [];

	for (let i = data_length - 1; i >= 0; i--) {
		const date = new Date(now.getTime() - i * 5 * 60 * 1000);
		const baseValue = 150000 + Math.sin(i / 20) * 50000;
		const noise = Math.random() * 20000 - 10000;

		dummyData.push({
			date: date.toISOString(),
			numberOfLots: Math.max(100000, Math.round(baseValue + noise)),
		});
	}

	return dummyData;
}

async function getData(data_length: number, treshhold = 100000, volume?: number) {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	if (volume !== undefined) {
		const { data, error } = await supabase
			.from("MarketData")
			.select("created_at, volume_tiers!inner(count)")
			.eq("volume_tiers.volume", volume)
			.gt("volume_tiers.count", `${treshhold}`)
			.order("id", { ascending: false })
			.limit(data_length);

		if (error) {
			console.log("Supabase error:", error);
			return generateDummyData(data_length);
		}

		if (!data || data.length === 0) {
			return generateDummyData(data_length);
		}

		const graphData = (data as any[])
			.map((row) => ({
				date: row.created_at,
				numberOfLots: row.volume_tiers?.[0]?.count ?? 0,
			}))
			.reverse();
		return graphData;
	}

	const { data, error } = await supabase
		.from("MarketData")
		.select("created_at, id, volume_tiers(volume, count)")
		.order("id", { ascending: false })
		.limit(data_length);

	if (error) {
		console.log("Supabase error:", error);
		return generateDummyData(data_length);
	}

	if (!data || data.length === 0) {
		return generateDummyData(data_length);
	}

	const graphData = (data as any[])
		.map((row) => {
			const tiers = (row.volume_tiers || []) as {
				volume: number;
				count: number;
			}[];
			if (tiers.length === 0) return null;
			const smallestTier = tiers.reduce((a, b) =>
				a.volume < b.volume ? a : b
			);
			return {
				date: row.created_at,
				numberOfLots: smallestTier.count,
			};
		})
		.filter(
			(row): row is { date: string; numberOfLots: number } =>
				row !== null && row.numberOfLots > treshhold
		)
		.reverse();
	return graphData;
}
export default getData;
