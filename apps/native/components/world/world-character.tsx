import { Circle, Group } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

export const WALK_ANIMATION_MS = 250;

const DOT_RADIUS_RATIO = 0.35;
const OUTLINE_WIDTH_RATIO = 0.06;
const DOT_COLOR = "#ef4444";
const OUTLINE_COLOR = "#ffffff";

export interface WorldCharacterProps {
	column: number;
	row: number;
	/** On-screen size of one tile, before zoom. */
	tileSize: number;
}

// Placeholder: a dot centred on its tile. Swap the drawing for a sprite later;
// the props (tile position + tile size) stay the same.
export function WorldCharacter({ column, row, tileSize }: WorldCharacterProps) {
	const targetX = (column + 0.5) * tileSize;
	const targetY = (row + 0.5) * tileSize;
	const radius = tileSize * DOT_RADIUS_RATIO;

	// Slides between tiles instead of jumping when the position changes.
	const cx = useSharedValue(targetX);
	const cy = useSharedValue(targetY);

	useEffect(() => {
		const timing = { duration: WALK_ANIMATION_MS };
		cx.value = withTiming(targetX, timing);
		cy.value = withTiming(targetY, timing);
	}, [targetX, targetY, cx, cy]);

	return (
		<Group>
			<Circle color={DOT_COLOR} cx={cx} cy={cy} r={radius} />
			<Circle
				color={OUTLINE_COLOR}
				cx={cx}
				cy={cy}
				r={radius}
				strokeWidth={tileSize * OUTLINE_WIDTH_RATIO}
				style="stroke"
			/>
		</Group>
	);
}
