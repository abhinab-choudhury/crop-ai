import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Modal() {
	return (
		<Container>
			<View className="flex-1 p-6">
				<View className="mb-8 flex-row items-center justify-between">
					<Text className="font-bold text-2xl text-foreground">Modal</Text>
				</View>
			</View>
		</Container>
	);
}
