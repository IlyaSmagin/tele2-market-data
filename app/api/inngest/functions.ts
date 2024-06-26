import { inngest } from "./client";
import saveMarketData from "../../actions/saveMarketData";
export const saveCurrentDataMarket = inngest.createFunction(
	{ id: "send-regular-request" },
	{ cron: "TZ=Europe/Paris */5 * * * *" }, // every 5 minutes
	async () => {
		// async ({ event, step }) => {
		// const uploadedData = await step.run("copy-images-to-s3", async () => {
		// 	return saveMarketData();
		// });
		// saveMarketData()
		// Load all the users from your database:
		// query and save market data
		return saveMarketData();
	}
);

export const helloTime = inngest.createFunction(
	{ id: "send-timed-query" },
	{ event: "test/hello.time" },
	async ({ event, step }) => {
		await step.sleepUntil("wait-for-iso-string", "2024-05-08T13:20:00");
		// You can also sleep until a timestamp within the event data.  This lets you
		// pass in a time for you to run the job:
		// await step.sleepUntil("wait-for-timestamp", event.data.run_at); // Assuming event.data.run_at is a timestamp.

		await step.run("do-some-work-in-the-future", async () => {
			console.log("timed request!");
			return { event, body: "timed response!!" };
		});
	}
);
export const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		await step.sleep("wait-a-moment", "1s");
		saveMarketData();
		return { event, body: "Saved world to db!" };
	}
);
