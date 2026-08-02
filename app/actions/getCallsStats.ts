import { createClient } from "@supabase/supabase-js";

export type CallsStats = {
	totalLotsNow: number;
	totalLots1d: number;
	totalLots7d: number;
};

async function getCallsStats(): Promise<CallsStats> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const now = Date.now();
	const offsets = [0, 1, 7];

	const totals = await Promise.all(
		offsets.map(async (days) => {
			const since = new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
			if (days === 0) {
				const { data } = await supabase
					.from("calls")
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

	const [totalLotsNow, totalLots1d, totalLots7d] = totals;
	return { totalLotsNow, totalLots1d, totalLots7d };
}

async function sumTiers(
	supabase: any,
	marketDataId: number
): Promise<number> {
	const { data, error } = await supabase
		.from("calls")
		.select("count")
		.eq("market_data_id", marketDataId);

	if (error || !data) return 0;
	return (data as { count: number }[]).reduce((sum, t) => sum + t.count, 0);
}

export default getCallsStats;
