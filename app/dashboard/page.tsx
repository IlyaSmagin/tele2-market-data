import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Dashboard() {
	return (
		<>
			<Tabs defaultValue="account" className="">
				<TabsList>
					<TabsTrigger value="internet">Internet</TabsTrigger>
					<TabsTrigger value="calls">Calls</TabsTrigger>
					<TabsTrigger value="messages">Messages</TabsTrigger>
				</TabsList>
				<TabsContent value="internet">traffic dashboard</TabsContent>
				<TabsContent value="calls">calls dashboard</TabsContent>
				<TabsContent value="messages">messages dashboard</TabsContent>
			</Tabs>
		</>
	);
}
