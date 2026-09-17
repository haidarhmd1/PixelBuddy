import { Button } from "heroui-native";
import { useCallback } from "react";
import { View } from "react-native";

export type WalkDirection = "up" | "down" | "left" | "right";

interface DevWalkControlsProps {
	onWalk: (direction: WalkDirection) => void;
}

interface WalkButtonProps extends DevWalkControlsProps {
	direction: WalkDirection;
	label: string;
}

function WalkButton({ direction, label, onWalk }: WalkButtonProps) {
	const handlePress = useCallback(() => onWalk(direction), [direction, onWalk]);

	return (
		<Button
			accessibilityLabel={`Walk ${direction}`}
			className="w-10"
			onPress={handlePress}
			size="sm"
			variant="secondary"
		>
			<Button.Label className="font-pixel">{label}</Button.Label>
		</Button>
	);
}

// Dev-only D-pad: moves the character one tile per press.
export function DevWalkControls({ onWalk }: DevWalkControlsProps) {
	return (
		<View className="absolute bottom-4 left-4 items-center gap-1">
			<WalkButton direction="up" label="↑" onWalk={onWalk} />
			<View className="flex-row gap-1">
				<WalkButton direction="left" label="←" onWalk={onWalk} />
				<WalkButton direction="down" label="↓" onWalk={onWalk} />
				<WalkButton direction="right" label="→" onWalk={onWalk} />
			</View>
		</View>
	);
}
