import { createClient } from "@supabase/supabase-js";

export type MarketStats = {
	totalLotsNow: number;
	totalLots1d: number;
	totalLots7d: number;
	totalLots30d: number;
};

async function getMarketStats(): Promise<MarketStats> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const now = Date.now();
	const offsets = [0, 1, 7, 30];

	// For each offset (days ago), find the snapshot closest to that moment and
	// sum its tier counts. 0 = current/latest snapshot.
	const totals = await Promise.all(
		offsets.map(async (days) => {
			const since = new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
			if (days === 0) {
				const { data } = await supabase
					.from("volume_tiers")
					.select("market_data_id")
					.order("market_data_id", { ascending: false })
					.limit(1)
					.single();
				return data
					? await sumTiers(supabase, (data as { market_data_id: number }).market_data_id)
					: 0;
			}
			const { data } = await supabase
				.from("MarketData")
				.select("id")
				.lte("created_at", since)
				.order("id", { ascending: false })
				.limit(1)
				.single();
			return data
				? await sumTiers(supabase, (data as { id: number }).id)
				: 0;
		})
	);

	const [totalLotsNow, totalLots1d, totalLots7d, totalLots30d] = totals;
	return { totalLotsNow, totalLots1d, totalLots7d, totalLots30d };
}

async function sumTiers(
	supabase: any,
	marketDataId: number
): Promise<number> {
	const { data, error } = await supabase
		.from("volume_tiers")
		.select("count")
		.eq("market_data_id", marketDataId);

	if (error || !data) return 0;
	return (data as { count: number }[]).reduce((sum, t) => sum + t.count, 0);
}

export default getMarketStats;
