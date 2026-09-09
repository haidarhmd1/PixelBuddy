import {
	Canvas,
	type DataSourceParam,
	Image,
	useAnimatedImageValue,
} from "@shopify/react-native-skia";
import { useCallback } from "react";
import { Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export type AnimationName = "cycle" | "idle" | "run" | "sleep" | "swim";

// Metro needs a literal string in every require() call to know which files to
// bundle -- a template literal path can't be resolved at build time. This map
// is what lets `animationName` still act dynamic from the caller's side.
const ANIMATIONS = {
	cycle: require("../../assets/images/avatar/animation/avatar-rpg-side-cycle-6f-v2-preview.gif"),
	idle: require("../../assets/images/avatar/animation/avatar-rpg-side-idle-6f-v2-preview.gif"),
	run: require("../../assets/images/avatar/animation/avatar-rpg-side-run-preview-v2.gif"),
	sleep: require("../../assets/images/avatar/animation/avatar-rpg-side-sleep-6f-v2-preview.gif"),
	swim: require("../../assets/images/avatar/animation/avatar-rpg-side-swim-6f-v2-preview.gif"),
} satisfies Record<AnimationName, DataSourceParam>;

export function Demo({ animationName }: { animationName: AnimationName }) {
	const isPaused = useSharedValue(false);
	// This can be an animated GIF or WebP file
	const bird = useAnimatedImageValue(ANIMATIONS[animationName], isPaused);

	const togglePaused = useCallback(() => {
		isPaused.value = !isPaused.value;
	}, [isPaused]);

	return (
		<Pressable onPress={togglePaused}>
			<Canvas style={{ height: 180, width: 320 }}>
				<Image
					fit="contain"
					height={180}
					image={bird}
					width={320}
					x={0}
					y={0}
				/>
			</Canvas>
		</Pressable>
	);
}
