import {
	Atlas,
	Canvas,
	FilterMode,
	Group,
	Skia,
	useImage,
} from "@shopify/react-native-skia";
import { Button } from "heroui-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
	clamp,
	useDerivedValue,
	useSharedValue,
	withDecay,
	withTiming,
} from "react-native-reanimated";
import { WALK_ANIMATION_MS, WorldCharacter } from "./world-character";
import {
	CHARACTER_START,
	SHEET_COLUMNS,
	TILE_SOURCE_SIZE,
	type TilePosition,
	WORLD_MAP,
} from "./world-map";

const MAX_ZOOM = 3;
const DOUBLE_TAP_ZOOM = 2;
const ZOOM_ANIMATION_MS = 250;

// Keeps the world covering the viewport: offset within [viewport - world, 0].
// If the world is smaller than the viewport, the range collapses to 0.
const clampOffset = (offset: number, viewport: number, worldSize: number) => {
	"worklet";
	return clamp(offset, Math.min(0, viewport - worldSize), 0);
};

// Offset that puts `center` (a world point at zoom 1) in the middle of the
// viewport at the given zoom, still clamped so the world keeps covering it.
const getCenteredOffset = (
	center: number,
	zoom: number,
	viewport: number,
	worldSize: number
) => {
	"worklet";
	return clampOffset(viewport / 2 - center * zoom, viewport, worldSize * zoom);
};

// Smallest zoom at which the world still covers the viewport, never above 1.
const getMinZoom = (
	viewportWidth: number,
	viewportHeight: number,
	worldWidth: number,
	worldHeight: number
) => {
	"worklet";
	return Math.min(
		1,
		Math.max(viewportWidth / worldWidth, viewportHeight / worldHeight)
	);
};

export interface TileWorldProps {
	/** Character tile position; defaults to CHARACTER_START. */
	characterPosition?: TilePosition;
	map?: number[][];
	/** Upscale factor applied to the 16x16 source tiles for on-screen size. */
	scale?: number;
}

export function TileWorld({
	map = WORLD_MAP,
	scale = 3,
	characterPosition = CHARACTER_START,
}: TileWorldProps) {
	const tilemap = useImage(
		require("../../assets/kenney_tiny-town/Tilemap/tilemap_packed.png")
	);

	const destTileSize = TILE_SOURCE_SIZE * scale;
	const rows = map.length;
	const columns = map[0]?.length ?? 0;
	const worldWidth = columns * destTileSize;
	const worldHeight = rows * destTileSize;
	const characterCenterX = (characterPosition.column + 0.5) * destTileSize;
	const characterCenterY = (characterPosition.row + 0.5) * destTileSize;

	const sprites = useMemo(
		() =>
			map.flatMap((row) =>
				row.map((tileIndex) => {
					const column = tileIndex % SHEET_COLUMNS;
					const sheetRow = Math.floor(tileIndex / SHEET_COLUMNS);
					return Skia.XYWHRect(
						column * TILE_SOURCE_SIZE,
						sheetRow * TILE_SOURCE_SIZE,
						TILE_SOURCE_SIZE,
						TILE_SOURCE_SIZE
					);
				})
			),
		[map]
	);

	const transforms = useMemo(
		() =>
			map.flatMap((row, rowIndex) =>
				row.map((_tileIndex, columnIndex) =>
					Skia.RSXform(
						scale,
						0,
						columnIndex * destTileSize,
						rowIndex * destTileSize
					)
				)
			),
		[map, scale, destTileSize]
	);

	const viewportWidth = useSharedValue(0);
	const viewportHeight = useSharedValue(0);
	const offsetX = useSharedValue(0);
	const offsetY = useSharedValue(0);
	const zoom = useSharedValue(1);
	const pinchLastScale = useSharedValue(1);
	const hasCenteredInitially = useRef(false);

	// Pan and pinch both update the offset incrementally (per-frame deltas),
	// so they compose when used together in one two-finger gesture.
	const gesture = useMemo(() => {
		const pan = Gesture.Pan()
			.onChange((event) => {
				offsetX.value = clampOffset(
					offsetX.value + event.changeX,
					viewportWidth.value,
					worldWidth * zoom.value
				);
				offsetY.value = clampOffset(
					offsetY.value + event.changeY,
					viewportHeight.value,
					worldHeight * zoom.value
				);
			})
			.onEnd((event) => {
				const minX = Math.min(0, viewportWidth.value - worldWidth * zoom.value);
				const minY = Math.min(
					0,
					viewportHeight.value - worldHeight * zoom.value
				);
				offsetX.value = withDecay({
					clamp: [minX, 0],
					velocity: event.velocityX,
				});
				offsetY.value = withDecay({
					clamp: [minY, 0],
					velocity: event.velocityY,
				});
			});

		// Zooms around the pinch focal point so the spot under the fingers stays put.
		const pinch = Gesture.Pinch()
			.onStart(() => {
				pinchLastScale.value = 1;
			})
			.onUpdate((event) => {
				const minZoom = getMinZoom(
					viewportWidth.value,
					viewportHeight.value,
					worldWidth,
					worldHeight
				);
				const nextZoom = clamp(
					zoom.value * (event.scale / pinchLastScale.value),
					minZoom,
					MAX_ZOOM
				);
				const ratio = nextZoom / zoom.value;
				pinchLastScale.value = event.scale;
				zoom.value = nextZoom;
				offsetX.value = clampOffset(
					event.focalX - (event.focalX - offsetX.value) * ratio,
					viewportWidth.value,
					worldWidth * nextZoom
				);
				offsetY.value = clampOffset(
					event.focalY - (event.focalY - offsetY.value) * ratio,
					viewportHeight.value,
					worldHeight * nextZoom
				);
			});

		// Toggles between normal size and DOUBLE_TAP_ZOOM around the tapped point.
		const doubleTap = Gesture.Tap()
			.numberOfTaps(2)
			.onEnd((event, success) => {
				if (!success) {
					return;
				}
				const minZoom = getMinZoom(
					viewportWidth.value,
					viewportHeight.value,
					worldWidth,
					worldHeight
				);
				const isZoomedIn = zoom.value >= DOUBLE_TAP_ZOOM;
				const targetZoom = isZoomedIn ? Math.max(1, minZoom) : DOUBLE_TAP_ZOOM;
				const ratio = targetZoom / zoom.value;
				const targetX = clampOffset(
					event.x - (event.x - offsetX.value) * ratio,
					viewportWidth.value,
					worldWidth * targetZoom
				);
				const targetY = clampOffset(
					event.y - (event.y - offsetY.value) * ratio,
					viewportHeight.value,
					worldHeight * targetZoom
				);
				const timing = { duration: ZOOM_ANIMATION_MS };
				zoom.value = withTiming(targetZoom, timing);
				offsetX.value = withTiming(targetX, timing);
				offsetY.value = withTiming(targetY, timing);
			});

		return Gesture.Simultaneous(pan, pinch, doubleTap);
	}, [
		worldWidth,
		worldHeight,
		offsetX,
		offsetY,
		zoom,
		pinchLastScale,
		viewportWidth,
		viewportHeight,
	]);

	const worldTransform = useDerivedValue(() => [
		{ translateX: offsetX.value },
		{ translateY: offsetY.value },
		{ scale: zoom.value },
	]);

	// The first layout is the first moment the viewport size is known,
	// so that is when the view starts centred on the character.
	const handleLayout = useCallback(
		(event: LayoutChangeEvent) => {
			const { height, width } = event.nativeEvent.layout;
			viewportWidth.value = width;
			viewportHeight.value = height;
			if (hasCenteredInitially.current) {
				return;
			}
			hasCenteredInitially.current = true;
			offsetX.value = getCenteredOffset(characterCenterX, 1, width, worldWidth);
			offsetY.value = getCenteredOffset(
				characterCenterY,
				1,
				height,
				worldHeight
			);
		},
		[
			viewportWidth,
			viewportHeight,
			offsetX,
			offsetY,
			characterCenterX,
			characterCenterY,
			worldWidth,
			worldHeight,
		]
	);

	// Camera follows the character: whenever it moves, re-centre at the current
	// zoom. Skipped until the first layout, which does the initial centring.
	useEffect(() => {
		const width = viewportWidth.value;
		const height = viewportHeight.value;
		if (width === 0 || height === 0) {
			return;
		}
		const timing = { duration: WALK_ANIMATION_MS };
		offsetX.value = withTiming(
			getCenteredOffset(characterCenterX, zoom.value, width, worldWidth),
			timing
		);
		offsetY.value = withTiming(
			getCenteredOffset(characterCenterY, zoom.value, height, worldHeight),
			timing
		);
	}, [
		characterCenterX,
		characterCenterY,
		worldWidth,
		worldHeight,
		offsetX,
		offsetY,
		zoom,
		viewportWidth,
		viewportHeight,
	]);

	const handleResetView = useCallback(() => {
		const timing = { duration: ZOOM_ANIMATION_MS };
		zoom.value = withTiming(1, timing);
		offsetX.value = withTiming(
			getCenteredOffset(characterCenterX, 1, viewportWidth.value, worldWidth),
			timing
		);
		offsetY.value = withTiming(
			getCenteredOffset(characterCenterY, 1, viewportHeight.value, worldHeight),
			timing
		);
	}, [
		zoom,
		offsetX,
		offsetY,
		viewportWidth,
		viewportHeight,
		characterCenterX,
		characterCenterY,
		worldWidth,
		worldHeight,
	]);

	return (
		<View className="flex-1">
			<GestureDetector gesture={gesture}>
				<View className="flex-1 overflow-hidden" onLayout={handleLayout}>
					{tilemap ? (
						<Canvas style={{ flex: 1 }}>
							<Group transform={worldTransform}>
								<Atlas
									image={tilemap}
									sampling={{ filter: FilterMode.Nearest }}
									sprites={sprites}
									transforms={transforms}
								/>
								<WorldCharacter
									column={characterPosition.column}
									row={characterPosition.row}
									tileSize={destTileSize}
								/>
							</Group>
						</Canvas>
					) : null}
				</View>
			</GestureDetector>
			<Button
				className="absolute top-2 right-2"
				onPress={handleResetView}
				size="sm"
				variant="secondary"
			>
				<Button.Label className="font-pixel">Reset view</Button.Label>
			</Button>
		</View>
	);
}
