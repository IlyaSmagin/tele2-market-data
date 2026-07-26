type Point = { date: string };

export function alignToDrop<T extends Point>(data: T[], layers = 7): T[] {
	const boundaries: number[] = [];
	for (let i = 0; i < data.length; i++) {
		const d = new Date(data[i].date);
		if (d.getUTCHours() === 21 && d.getUTCMinutes() === 5) {
			boundaries.push(i);
		}
	}

	if (boundaries.length < 2) return data;

	const segSize = Math.floor(data.length / layers);
	if (segSize < 1) return data;

	let bestOffset = 0;
	let bestScore = Infinity;

	for (let offset = 0; offset < segSize; offset++) {
		let score = 0;
		for (let seg = 0; seg < layers; seg++) {
			const foldIdx = offset + seg * segSize;
			const nearest = boundaries.reduce(
				(best, b) => Math.min(best, Math.abs(b - foldIdx)),
				Infinity
			);
			score += nearest * nearest;
		}
		if (score < bestScore) {
			bestScore = score;
			bestOffset = offset;
		}
	}

	if (bestOffset === 0) return data;
	return [...data.slice(bestOffset), ...data.slice(0, bestOffset)];
}
