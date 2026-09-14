/** biome-ignore-all lint/performance/noJsxPropsBind: Animation buttons use direct state updates */

import { Platform, View } from "react-native";
import { Container } from "@/components/container";
import { Main } from "@/components/Main/main";
import { NeedsAuthorization } from "@/components/Main/needsAuthorization";
import { useHealthkitStatus } from "@/utils/healthkit";

export default function Home() {
	const { isAuthorized, isAvailable } = useHealthkitStatus();

	return (
		<Container>
			{Platform.OS === "ios" && isAvailable && !isAuthorized ? (
				<View className="px-4 pb-4 m-auto">
					<NeedsAuthorization />
				</View>
			) : (
				<Main />
			)}
		</Container>
	);
}
