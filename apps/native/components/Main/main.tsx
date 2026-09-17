import { Surface } from "heroui-native";
import { View } from "react-native";
import { BasicStats } from "../basicStats/BasicStats";
import { Container } from "../container";
import { MainRender } from "./main_render";

export function Main() {
	return (
		<Container className="flex" isScrollable={false}>
			<View className="pt-4">
				<BasicStats />
			</View>
			<Surface className="flex-1 w-full rounded-none bg-red-300">
				<View className="flex-1">
					<MainRender />
				</View>
			</Surface>
		</Container>
	);
}
