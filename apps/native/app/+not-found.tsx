import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Container>
				<View className="flex-1 items-center justify-center p-6">
					<View className="items-center">
						<Text className="mb-4 text-6xl">🤔</Text>
						<Text className="mb-2 text-center font-bold text-2xl text-foreground">
							Page Not Found
						</Text>
						<Text className="mb-8 max-w-sm text-center text-muted-foreground">
							Sorry, the page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Text className="rounded-lg bg-primary/10 px-6 py-3 font-medium text-primary">
								Go to Home
							</Text>
						</Link>
					</View>
				</View>
			</Container>
		</>
	);
}
