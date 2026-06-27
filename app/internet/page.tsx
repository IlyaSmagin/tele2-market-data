import getData from "../actions/getData";
import LineChart from "../components/chart";
import CandlestickChart from "../components/candlestickChart";
import BarChart from "../components/barChart";

export const revalidate = 300; // revalidate at most every 5 minutes

// Dummy data: quantity of lots available for each GB volume tier (index 0 = 1 GB, index 119 = 120 GB)
const volumeDistributionData: number[] = [
	238030, 105132, 91014, 38010, 80560, 28891, 23113, 9962, 7411, 77121,
	4234, 4234,3347, 3347, 14317, 22406,
	// remaining 105 values from 0 to 1000
	841, 512, 993, 77, 430, 265, 188, 600, 50, 912,
	344, 721, 88, 477, 130, 855, 23, 667, 390, 145,
	798, 61, 533, 270, 410, 900, 37, 654, 183, 749,
	295, 820, 112, 456, 38, 580, 222, 763, 96, 487,
	319, 875, 153, 624, 47, 701, 238, 815, 69, 442,
	167, 933, 384, 556, 291, 728, 85, 463, 310, 877,
	142, 605, 33, 790, 257, 481, 364, 919, 76, 533,
	208, 651, 127, 744, 389, 862, 195, 517, 43, 680,
	302, 798, 158, 425, 261, 837, 94, 573, 336, 712,
	51, 689, 275, 444, 170, 921, 63, 507, 348, 815,
	233, 672, 119, 584,
];

export default async function Week() {
	const dataPoints = await getData(2016, 0);//288 day, 2016 week
	const filteredDataPoints = await getData(2016, 100000);//288 day, 2016 week
	return (
    <>
			<h1 className="text-2xl">Weekly graph (messy)</h1>
			<LineChart data={dataPoints} />
			<h1 className="text-2xl">Lots distribution by volume range</h1>
			<CandlestickChart data={filteredDataPoints} bucketCount={12} />
			<h1 className="text-2xl">Volume distribution (lots per GB tier)</h1>
			<BarChart data={volumeDistributionData} />
			<h1 className="text-2xl">Weekly graph (filtered)</h1>
			<LineChart data={filteredDataPoints} />
			<h1 className="text-2xl">Weekly graph (folded)</h1>
			<LineChart data={filteredDataPoints} numberOfLayers={7} />
    </>
	);
}
