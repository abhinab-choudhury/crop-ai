import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
	const { data: session } = authClient.useSession();
	const [value, setValue] = React.useState("signin");
	const queryClient = useQueryClient();
	const healthCheck = useQuery({
		queryKey: ["healthCheck"],
		queryFn: () =>
			fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}`).then((res) =>
				res.json(),
			),
	});
	const privateData = useQuery({
		queryKey: ["privateData"],
		queryFn: () =>
			fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}`).then((res) =>
				res.json(),
			),
	});

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="p-4">
					{session?.user ? (
						<View className="mb-6 rounded-lg border border-border bg-card p-4">
							<View className="mb-2 flex-row items-center justify-between">
								<Text className="text-base text-foreground">
									Welcome,{" "}
									<Text className="font-medium">{session.user.name}</Text>
								</Text>
							</View>
							<Text className="mb-4 text-muted-foreground text-sm">
								{session.user.email}
							</Text>

							<TouchableOpacity
								className="self-start rounded-md bg-destructive px-4 py-2"
								onPress={() => {
									authClient.signOut();
									queryClient.invalidateQueries({ queryKey: ["healthCheck"] });
								}}
							>
								<Text className="font-medium text-white">Sign Out</Text>
							</TouchableOpacity>
						</View>
					) : null}
					<View className="mb-6 rounded-lg border border-border p-4">
						<Text className="mb-3 font-medium text-foreground">API Status</Text>
						<View className="flex-row items-center gap-2">
							<View
								className={`h-3 w-3 rounded-full ${
									healthCheck.data ? "bg-green-500" : "bg-red-500"
								}`}
							/>
							<Text className="text-muted-foreground">
								{healthCheck.isLoading
									? "Checking..."
									: healthCheck.data
										? "Connected to API"
										: "API Disconnected"}
							</Text>
						</View>
					</View>
					<View className="mb-6 rounded-lg border border-border p-4">
						<Text className="mb-3 font-medium text-foreground">
							Private Data
						</Text>
						{privateData && (
							<View>
								<Text className="text-muted-foreground">
									{privateData.data?.message}
								</Text>
							</View>
						)}
					</View>
					{!session?.user && (
						<View className="flex w-full max-w-sm flex-col gap-6">
							<Tabs value={value} onValueChange={setValue}>
								<TabsList>
									<TabsTrigger value="signin">
										<Text className="font-bold">Sign In</Text>
									</TabsTrigger>
									<TabsTrigger value="signup">
										<Text className="font-bold">Sign Up</Text>
									</TabsTrigger>
								</TabsList>

								<TabsContent value="signin">
									<SignIn />
								</TabsContent>

								<TabsContent value="signup">
									<SignUp />
								</TabsContent>
							</Tabs>
						</View>
					)}
				</View>
			</ScrollView>
		</Container>
	);
}
