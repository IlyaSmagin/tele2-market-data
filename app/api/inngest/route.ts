import { serve } from "inngest/next";
import { inngest } from "./client";
import { helloWorld, helloTime, helloRegular } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [helloWorld, helloTime, helloRegular],
});
