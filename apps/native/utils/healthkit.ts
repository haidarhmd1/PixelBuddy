import {
	AuthorizationRequestStatus,
	useHealthkitAuthorization,
	useIsHealthDataAvailable,
	useMostRecentQuantitySample,
	useStatisticsForQuantity,
} from "@kingstinct/react-native-healthkit";
import { useMemo } from "react";

export const HEALTHKIT_READ_TYPES = [
	"HKQuantityTypeIdentifierStepCount",
	"HKQuantityTypeIdentifierHeartRate",
	"HKQuantityTypeIdentifierActiveEnergyBurned",
	"HKWorkoutTypeIdentifier",
] as const;

export function useHealthkitStatus() {
	const isAvailable = useIsHealthDataAvailable();
	const [authStatus, requestAuthorization] = useHealthkitAuthorization({
		toRead: HEALTHKIT_READ_TYPES,
	});

	return {
		authStatus,
		isAuthorized: authStatus === AuthorizationRequestStatus.unnecessary,
		isAvailable,
		requestAuthorization,
	};
}

function useStartOfToday() {
	return useMemo(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	}, []);
}

export function useTodayStepCount() {
	const startOfToday = useStartOfToday();
	const stats = useStatisticsForQuantity(
		"HKQuantityTypeIdentifierStepCount",
		["cumulativeSum"],
		startOfToday
	);

	return stats?.sumQuantity?.quantity ?? null;
}

export function useLatestHeartRate() {
	const sample = useMostRecentQuantitySample(
		"HKQuantityTypeIdentifierHeartRate"
	);
	return sample ? { quantity: sample.quantity, unit: sample.unit } : null;
}

export function useHKQuantityTypeIdentifierWalkingHeartRateAverage() {
	const sample = useMostRecentQuantitySample(
		"HKQuantityTypeIdentifierActiveEnergyBurned",
		"cal"
	);

	return sample ? { quantity: sample.quantity, unit: sample.unit } : null;
}
