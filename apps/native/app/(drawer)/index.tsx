/** biome-ignore-all lint/performance/noJsxPropsBind: Animation buttons use direct state updates */

import { useMostRecentWorkout } from "@kingstinct/react-native-healthkit";
import { Button, Chip, Separator, Surface } from "heroui-native";
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { Container } from "@/components/container";
import { type AnimationName, Demo } from "@/components/skia/demo";
import {
	useHealthkitStatus,
	useHKQuantityTypeIdentifierWalkingHeartRateAverage,
	useLatestHeartRate,
	useTodayStepCount,
} from "@/utils/healthkit";
import { getWorkoutActivityTypeLabel } from "@/utils/workout-activity-type";

export default function Home() {
	const { isAvailable, isAuthorized, requestAuthorization } =
		useHealthkitStatus();
	const steps = useTodayStepCount();
	const heartRate = useLatestHeartRate();
	const caloriesBurnedTillNow =
		useHKQuantityTypeIdentifierWalkingHeartRateAverage();

	const mostRecentWorkout = useMostRecentWorkout();

	const [animationName, setAnimationName] = useState<AnimationName>("cycle");

	return (
		<Container className="px-4 pb-4">
			<Surface className="my-5 rounded bg-white w-full dark:bg-gray-800">
				<Text className="font-pixel text-4xl text-center dark:text-white">
					PixelBuddy
				</Text>
			</Surface>

			{Platform.OS === "ios" && isAvailable && !isAuthorized && (
				<Surface className="rounded-none  mb-5 bg-amber-300">
					<Button
						onPress={requestAuthorization}
						className="rounded-none border-red-300 bg-red-700 border-4"
					>
						<Button.Label className="font-tiny5">
							Connect Apple Health
						</Button.Label>
					</Button>
				</Surface>
			)}

			{/* Skia Character */}
			<Surface className="mb-5 rounded bg-white w-full dark:bg-gray-800">
				<Demo animationName={animationName} />
			</Surface>
			{/* End Skia Character */}

			<Surface
				className="flex-row flex-wrap w-full m-auto mb-5 gap-3 rounded"
				variant="secondary"
			>
				<Button
					className="w-[48%] rounded-none border-4 border-blue-600"
					onPress={() => setAnimationName("cycle")}
				>
					<Button.Label className="font-tiny5">Cycling</Button.Label>
				</Button>
				<Button
					className="w-[48%] rounded-none border-4 border-blue-600"
					onPress={() => setAnimationName("swim")}
				>
					<Button.Label className="font-tiny5">Swimming</Button.Label>
				</Button>
				<Button
					className="w-[48%] rounded-none border-4 border-blue-600"
					onPress={() => setAnimationName("idle")}
				>
					<Button.Label className="font-tiny5">Idle</Button.Label>
				</Button>
				<Button
					className="w-[48%] rounded-none border-4 border-blue-600"
					onPress={() => setAnimationName("run")}
				>
					<Button.Label className="font-tiny5">Run</Button.Label>
				</Button>
				<Button
					className="w-[48%] rounded-none border-4 border-blue-600"
					onPress={() => setAnimationName("sleep")}
				>
					<Button.Label className="font-tiny5">Sleep</Button.Label>
				</Button>
			</Surface>

			{Platform.OS === "ios" && isAuthorized && isAvailable && (
				<>
					<Surface className="mb-5 rounded-xl p-4" variant="secondary">
						<View className="mb-3">
							<Text className="font-medium font-tiny5 text-foreground">
								Recent Workout -{" "}
								{mostRecentWorkout
									? getWorkoutActivityTypeLabel(
											mostRecentWorkout.workoutActivityType
										)
									: "No recent workout"}
							</Text>
						</View>
						<View className="flex-1 rounded p-3 mb-3">
							<Surface variant="tertiary">
								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{mostRecentWorkout?.duration
										? `${Math.round(mostRecentWorkout.duration.quantity / 60)} min`
										: "-"}
								</Text>

								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{mostRecentWorkout
										? `${Math.round(mostRecentWorkout.totalEnergyBurned ? mostRecentWorkout.totalEnergyBurned?.quantity : 0)} / ${mostRecentWorkout.totalEnergyBurned ? mostRecentWorkout.totalEnergyBurned.unit : "-"}`
										: "-"}
								</Text>

								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{mostRecentWorkout?.totalDistance
										? `${Math.round(mostRecentWorkout.totalDistance.quantity)} / ${mostRecentWorkout.totalDistance.unit}`
										: "-"}
								</Text>
							</Surface>
						</View>
					</Surface>
					<Surface className="mb-5 rounded-xl p-4" variant="secondary">
						<View className="mb-3 flex-row items-center justify-between">
							<Text className="font-medium font-pixel text-foreground">
								Health
							</Text>
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

						<Separator className="mb-3" />

						<View className="m-auto flex-row flex-wrap gap-3">
							<Surface
								className="w-[48%] rounded-none border-4 border-gray-500 p-3 mb-3"
								variant="tertiary"
							>
								<Text className="mb-1 text-muted text-xs font-pixel">
									Steps today
								</Text>
								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{steps === null ? "—" : Math.round(steps)}
								</Text>
							</Surface>
							<Surface
								className="w-[48%] rounded-none border-4 border-gray-500 p-3 mb-3"
								variant="tertiary"
							>
								<Text className="mb-1 text-muted text-xs font-pixel">
									Heart rate
								</Text>
								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{heartRate === null
										? "—"
										: `${Math.round(heartRate.quantity)} ${heartRate.unit}`}
								</Text>
							</Surface>

							<Surface
								className="w-[48%] rounded-none border-4 border-gray-500 p-3 mb-3"
								variant="tertiary"
							>
								<Text className="mb-1 text-muted text-xs font-pixel">
									Calories burned till now
								</Text>
								<Text className="font-semibold text-foreground text-lg font-tiny5">
									{caloriesBurnedTillNow === null
										? "—"
										: `${Math.round(caloriesBurnedTillNow.quantity)} / ${caloriesBurnedTillNow.unit}`}
								</Text>
							</Surface>
						</View>
					</Surface>
				</>
			)}
		</Container>
	);
}
