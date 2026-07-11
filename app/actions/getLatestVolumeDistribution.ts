import { createClient } from "@supabase/supabase-js";

async function getLatestVolumeDistribution(): Promise<number[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const { data: latest } = await supabase
		.from("volume_tiers")
		.select("market_data_id")
		.order("market_data_id", { ascending: false })
		.limit(1)
		.single();

	if (!latest) return [];

	const { data, error } = await supabase
		.from("volume_tiers")
		.select("count")
		.eq("market_data_id", latest.market_data_id)
		.order("volume", { ascending: true });

	if (error || !data) return [];

	return data.map((t) => t.count);
}
export default getLatestVolumeDistribution;
