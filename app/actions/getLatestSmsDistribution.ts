import { createClient } from "@supabase/supabase-js";
import { RangeSelection, applyRangeSelection, TierCandle } from "@/lib/range";

export type { TierCandle };

async function getLatestSmsDistribution(
	selection?: RangeSelection
): Promise<TierCandle[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const { data: latestRef } = await supabase
		.from("sms")
		.select("market_data_id")
		.order("market_data_id", { ascending: false })
		.limit(1)
		.single();

	if (!latestRef) return [];

	const latestId = (latestRef as { market_data_id: number }).market_data_id;

	const { data: latest, error: latestErr } = await supabase
		.from("sms")
		.select("volume, count")
		.eq("market_data_id", latestId)
		.order("volume", { ascending: true });

	if (latestErr || !latest) return [];

	const base = (latest as { volume: number; count: number }[]).map((t) => ({
		volume: t.volume,
		lotMin: t.count,
		lotMax: t.count,
		lotMedian: t.count,
		count: t.count,
	}));

	const { data: history, error: histErr } = await supabase
		.from("sms")
		.select("volume, count, market_data_id!inner(created_at)")
		.gte("market_data_id.created_at", since);

	if (!histErr && history && history.length > 0) {
		type Row = { volume: number; count: number };
		const groups: { [key: number]: number[] } = {};
		for (const row of history as Row[]) {
			if (!groups[row.volume]) groups[row.volume] = [];
			groups[row.volume].push(row.count);
		}
		for (const candle of base) {
			const counts = groups[candle.volume];
			if (!counts || counts.length === 0) continue;
			const sorted = counts.slice().sort((a, z) => a - z);
			const mid = Math.floor(sorted.length / 2);
			const median =
				sorted.length % 2 === 0
					? (sorted[mid - 1] + sorted[mid]) / 2
					: sorted[mid];
			candle.lotMin = sorted[0];
			candle.lotMax = sorted[sorted.length - 1];
			candle.lotMedian = median;
		}
	}

	base.sort((a, z) => a.volume - z.volume);

	if (selection) {
		return applyRangeSelection(base, selection);
	}
	return base;
}

export default getLatestSmsDistribution;