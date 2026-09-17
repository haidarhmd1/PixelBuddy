import { useCallback, useState } from "react";
import { View } from "react-native";
import {
	DevWalkControls,
	type WalkDirection,
} from "../world/dev-walk-controls";
import { TileWorld } from "../world/tile-world";
import {
	CHARACTER_START,
	isWalkable,
	type TilePosition,
	WORLD_MAP,
} from "../world/world-map";

const WALK_STEPS: Record<WalkDirection, TilePosition> = {
	down: { column: 0, row: 1 },
	left: { column: -1, row: 0 },
	right: { column: 1, row: 0 },
	up: { column: 0, row: -1 },
};

export function MainRender() {
	const [characterPosition, setCharacterPosition] =
		useState<TilePosition>(CHARACTER_START);

	// Blocked moves (map edge or solid tile) keep the current position.
	const handleWalk = useCallback((direction: WalkDirection) => {
		const step = WALK_STEPS[direction];
		setCharacterPosition((current) => {
			const next = {
				column: current.column + step.column,
				row: current.row + step.row,
			};
			return isWalkable(WORLD_MAP, next) ? next : current;
		});
	}, []);

	return (
		<View className="flex-1">
			<TileWorld characterPosition={characterPosition} />
			{/* biome-ignore lint/correctness/noUndeclaredVariables: __DEV__ is a React Native global */}
			{__DEV__ ? <DevWalkControls onWalk={handleWalk} /> : null}
		</View>
	);
}
