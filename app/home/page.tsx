import Link from "next/link";
import {
	LineChart,
	CandlestickChart,
	BarChart3,
	ArrowRight,
	Activity,
	TrendingUp,
	Layers,
	Phone,
	MessageSquare,
	Wifi,
} from "lucide-react";

const graphs = [
	{
		icon: LineChart,
		title: "Time-series line graphs",
		description:
			"Track the price of a 1 GB lot minute by minute across the last 24 hours or a full week. Spot trends, daily cycles, and sudden swings before they cost you.",
	},
	{
		icon: CandlestickChart,
		title: "Candlestick ranges",
		description:
			"See the high and low number of lots within each volume bracket. Candlesticks reveal volatility at a glance, so you know which traffic tiers are stable and which are turbulent.",
	},
	{
		icon: BarChart3,
		title: "Log-scale volume bars",
		description:
			"Compare how much of every GB tier is sitting on the market. A logarithmic axis keeps both tiny pockets and massive outliers readable in a single view.",
	},
];

const decisions = [
	{
		icon: Wifi,
		title: "Internet traffic",
		description:
			"Decide whether to hold or sell your gigabytes based on live supply and price movement across the 1 GB market.",
	},
	{
		icon: Phone,
		title: "Call minutes",
		description:
			"Read the demand curve for voice bundles and time your listings when the market leans in your favor.",
	},
	{
		icon: MessageSquare,
		title: "SMS packs",
		description:
			"Monitor messaging inventory so you never undercut yourself when offloading unused SMS allowances.",
	},
];

const steps = [
	{
		icon: Activity,
		title: "Collect",
		description:
			"Market snapshots are captured on a five-minute cadence and stored as a continuous, queryable history.",
	},
	{
		icon: Layers,
		title: "Visualize",
		description:
			"Raw, filtered, and folded views turn noisy data into clean, server-rendered graphs that load instantly.",
	},
	{
		icon: TrendingUp,
		title: "Decide",
		description:
			"Patterns become obvious — so you sell traffic, minutes, and messages at the right moment, at the right price.",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
			{/* Hero */}
			<section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center md:py-32">
					<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
						Live Tele2 market data
					</span>
					<h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
						See the T2 market clearly. Sell at the right moment.
					</h1>
					<p className="max-w-2xl text-pretty text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
						T2Market turns raw telecom market data into sharp, readable
						graphs — so you know exactly when and how to sell your traffic,
						call minutes, and SMS for the best possible return.
					</p>
					<div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
						>
							Open the dashboard
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							href="/internet"
							className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
						>
							Explore the graphs
						</Link>
					</div>
				</div>
			</section>

			{/* What it is */}
			<section className="border-b border-zinc-200 px-6 py-20 dark:border-zinc-800">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
						A market monitor built for traders of telecom traffic
					</h2>
					<p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
						Prices for gigabytes, minutes, and messages shift constantly as
						supply and demand move. T2Market continuously records the Tele2
						market and presents it through purpose-built graphs, giving you the
						context to make informed, profitable decisions instead of guessing.
					</p>
				</div>
			</section>

			{/* Graph types */}
			<section className="border-b border-zinc-200 px-6 py-20 dark:border-zinc-800">
				<div className="mx-auto max-w-5xl">
					<div className="mb-12 max-w-2xl">
						<h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
							Three views, one complete picture
						</h2>
						<p className="mt-3 text-pretty text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
							Each graph answers a different question about the market. Together
							they tell you what is happening, how volatile it is, and where the
							opportunity sits.
						</p>
					</div>
					<div className="grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 md:grid-cols-3">
						{graphs.map((graph) => (
							<div
								key={graph.title}
								className="flex flex-col gap-4 bg-white p-8 dark:bg-black"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
									<graph.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
								</div>
								<h3 className="text-lg font-medium">{graph.title}</h3>
								<p className="text-pretty leading-relaxed text-zinc-500 dark:text-zinc-400">
									{graph.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it helps you decide */}
			<section className="border-b border-zinc-200 px-6 py-20 dark:border-zinc-800">
				<div className="mx-auto max-w-5xl">
					<div className="mb-12 max-w-2xl">
						<h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
							Make smarter selling decisions
						</h2>
						<p className="mt-3 text-pretty text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
							Whatever you are holding, the data tells you when the market is
							ready for it.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{decisions.map((item) => (
							<div
								key={item.title}
								className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-8 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
							>
								<item.icon className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
								<h3 className="text-lg font-medium">{item.title}</h3>
								<p className="text-pretty leading-relaxed text-zinc-500 dark:text-zinc-400">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="border-b border-zinc-200 px-6 py-20 dark:border-zinc-800">
				<div className="mx-auto max-w-5xl">
					<h2 className="mb-12 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
						From raw snapshots to confident calls
					</h2>
					<div className="grid gap-10 md:grid-cols-3">
						{steps.map((step, index) => (
							<div key={step.title} className="flex flex-col gap-4">
								<div className="flex items-center gap-3">
									<span className="font-mono text-sm text-zinc-400 dark:text-zinc-600">
										0{index + 1}
									</span>
									<div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
									<step.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
								</div>
								<h3 className="text-lg font-medium">{step.title}</h3>
								<p className="text-pretty leading-relaxed text-zinc-500 dark:text-zinc-400">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="px-6 py-24">
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
					<h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
						Stop guessing. Start reading the market.
					</h2>
					<p className="max-w-xl text-pretty text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
						Open the dashboard and watch the live T2 market unfold across every
						graph.
					</p>
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
					>
						Go to dashboard
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</section>
		</div>
	);
}
