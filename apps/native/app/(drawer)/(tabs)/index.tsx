import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";

export default function TabOne() {
	return (
		<Container>
			<ScrollView className="flex-1 p-6">
				<View className="py-8">
					<Text className="mb-2 font-bold text-3xl text-foreground">
						Tab One
					</Text>
					<Text className="text-lg text-muted-foreground">
						Explore the first section of your app
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
}
