import { Surface } from "heroui-native";
import { View } from "react-native";
import { TileWorld } from "../world/tile-world";

export function MainRender() {
	return (
		<Surface className="h-60 w-full rounded">
			<View>
				<TileWorld />
			</View>
		</Surface>
	);
}
