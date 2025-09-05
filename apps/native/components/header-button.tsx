import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable } from "react-native";

export const HeaderButton = forwardRef<
	typeof Pressable,
	{ onPress?: () => void }
>(({ onPress }, _ref) => {
	return (
		<Pressable
			onPress={onPress}
			className="mr-2 rounded-lg bg-secondary/50 p-2 active:bg-secondary"
		>
			{({ pressed }) => (
				<FontAwesome
					name="info-circle"
					size={20}
					className="text-secondary-foreground"
					style={{
						opacity: pressed ? 0.7 : 1,
					}}
				/>
			)}
		</Pressable>
	);
});
