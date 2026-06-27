import saveMarketData from "../actions/saveMarketData";

export default async function Home() {
	return (
		<>
			<div className="text-4xl">Tele2 market graph</div>
			<form action={saveMarketData}>
				<button disabled type="submit">Save data to db</button>
			</form>
		</>
	);
}
