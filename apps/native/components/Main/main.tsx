import { View } from "react-native";
import { BasicStats } from "../basicStats/BasicStats";
import { Container } from "../container";
import { MainRender } from "./main_render";

export function Main() {
	return (
		<Container className="flex">
			<View className="pt-4 flex-1">
				<BasicStats />
			</View>
			<MainRender />
		</Container>
	);
}
