type Point = { date: string; numberOfLots: number };

export function interpolateWeek(
	data: Point[],
	layers = 7
): Point[] {
	const boundaries: number[] = [];
	for (let i = 0; i < data.length; i++) {
		const d = new Date(data[i].date);
		if (d.getUTCHours() === 21 && d.getUTCMinutes() === 5) {
			boundaries.push(i);
		}
	}

	if (boundaries.length < layers) return data;

	const startIdx = boundaries[boundaries.length - layers];
	const dayStartMs = new Date(data[startIdx].date).getTime();
	const intervalMs = 5 * 60 * 1000;
	const pointsPerDay = 288;
	const now = Date.now();

	const result: Point[] = [];
	let done = false;

	for (let day = 0; day < layers && !done; day++) {
		const dayOffset = day * pointsPerDay;
		for (let i = 0; i < pointsPerDay && !done; i++) {
			const targetMs = dayStartMs + (dayOffset + i) * intervalMs;

			if (day === layers - 1 && targetMs > now) {
				done = true;
				break;
			}

			let before = data[startIdx];
			let after = data[startIdx];

			for (let j = startIdx; j < data.length; j++) {
				const t = new Date(data[j].date).getTime();
				if (t <= targetMs) before = data[j];
				if (t >= targetMs) {
					after = data[j];
					break;
				}
				after = data[j];
			}

			const beforeMs = new Date(before.date).getTime();
			const afterMs = new Date(after.date).getTime();
			let value: number;

			if (beforeMs === afterMs) {
				value = before.numberOfLots;
			} else {
				const ratio = (targetMs - beforeMs) / (afterMs - beforeMs);
				value = Math.round(
					before.numberOfLots +
						(after.numberOfLots - before.numberOfLots) * ratio
				);
			}

			result.push({
				date: new Date(targetMs).toISOString(),
				numberOfLots: value,
			});
		}
	}

	return result;
}

export function splitIntoSegments(data: Point[], pointsPerDay = 288): Point[][] {
	const segments: Point[][] = [];
	for (let i = 0; i < data.length; i += pointsPerDay) {
		const segment = data.slice(i, i + pointsPerDay);
		if (segment.length > 0) segments.push(segment);
	}
	return segments;
}
