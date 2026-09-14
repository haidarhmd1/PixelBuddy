import { useMostRecentWorkout } from "@kingstinct/react-native-healthkit";
import { Chip, Surface } from "heroui-native";
import { Text, View } from "react-native";

import {
	useHealthkitStatus,
	useHKQuantityTypeIdentifierWalkingHeartRateAverage,
	useLatestHeartRate,
	useTodayStepCount,
} from "@/utils/healthkit";

export function BasicStats() {
	const _heartRate = useLatestHeartRate();
	const _caloriesBurnedTillNow =
		useHKQuantityTypeIdentifierWalkingHeartRateAverage();
	const _mostRecentWorkout = useMostRecentWorkout();
	const _steps = useTodayStepCount();
	const { isAuthorized } = useHealthkitStatus();

	return (
		<Surface className="mb-5 rounded-xl p-4" variant="secondary">
			<View className="mb-3 flex-row items-center justify-between">
				<Text className="font-medium font-pixel text-foreground">Health</Text>
				<Chip
					color={isAuthorized ? "success" : "danger"}
					size="sm"
					variant="secondary"
				>
					<Chip.Label className="font-pixel">
						{isAuthorized ? "CONNECTED" : "NOT CONNECTED"}
					</Chip.Label>
				</Chip>
			</View>
		</Surface>
	);
}
