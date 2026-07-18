export type RangeMode = "top" | "least" | "custom";

export type TierCandle = {
	volume: number;
	lotMin: number;
	lotMax: number;
	lotMedian: number;
	count: number;
};

export type RangeSelection =
	| { mode: "top" }
	| { mode: "least" }
	| { mode: "custom"; min: number; max: number };

export const VOLUME_MIN = 1;
export const VOLUME_MAX = 120;

type RawParams = {
	mode?: string | string[] | undefined;
	min?: string | string[] | undefined;
	max?: string | string[] | undefined;
};

function first(value: string | string[] | undefined): string | undefined {
	if (Array.isArray(value)) return value[0];
	return value;
}

function toInt(value: string | undefined): number | null {
	if (value === undefined || value.trim() === "") return null;
	const n = Number.parseInt(value, 10);
	if (Number.isNaN(n)) return null;
	return n;
}

export function parseRangeParams(params: RawParams): RangeSelection {
	const mode = first(params.mode);
	const minRaw = toInt(first(params.min));
	const maxRaw = toInt(first(params.max));

	if (mode === "top") return { mode: "top" };
	if (mode === "least") return { mode: "least" };

	if (mode === "custom") {
		let min = minRaw ?? VOLUME_MIN;
		let max = maxRaw ?? VOLUME_MAX;
		min = Math.min(Math.max(min, VOLUME_MIN), VOLUME_MAX);
		max = Math.min(Math.max(max, VOLUME_MIN), VOLUME_MAX);
		if (min > max) [min, max] = [max, min];
		return { mode: "custom", min, max };
	}

	// No/invalid mode -> full range (custom covering everything).
	return { mode: "custom", min: VOLUME_MIN, max: VOLUME_MAX };
}

export function selectionToParams(selection: RangeSelection): string {
	if (selection.mode === "top") return "mode=top";
	if (selection.mode === "least") return "mode=least";
	return `mode=custom&min=${selection.min}&max=${selection.max}`;
}

export function applyRangeSelection<T extends { volume: number; count: number }>(
	data: T[],
	selection: RangeSelection
): T[] {
	if (selection.mode === "top") {
		return [...data]
			.sort((a, b) => b.count - a.count)
			.slice(0, 5)
			.sort((a, b) => a.volume - b.volume);
	}
	if (selection.mode === "least") {
		return [...data]
			.sort((a, b) => a.count - b.count)
			.slice(0, 5)
			.sort((a, b) => a.volume - b.volume);
	}
	return data.filter(
		(d) => d.volume >= selection.min && d.volume <= selection.max
	);
}
