import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";
import { useHealthkitStatus } from "@/utils/healthkit";

export function NeedsAuthorization() {
	const { requestAuthorization } = useHealthkitStatus();

	return (
		<View className="w-80 m-auto">
			<View className="mb-5">
				<Text className="font-pixel text-center dark:text-white">
					In order for the game/app to work
				</Text>
			</View>
			<Surface className="rounded mb-5 bg-amber-300">
				<Button
					onPress={requestAuthorization}
					className="rounded border-red-300 bg-red-700 border-4 h-auto p-2 text-center"
				>
					<Button.Label className="font-pixel">
						connect Apple Health
					</Button.Label>
				</Button>
			</Surface>
		</View>
	);
}
