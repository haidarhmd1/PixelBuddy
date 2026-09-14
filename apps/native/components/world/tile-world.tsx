import {
	Atlas,
	Canvas,
	FilterMode,
	Skia,
	useImage,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";

// Kenney "Tiny Town" packed sheet: 16x16 tiles, no gutters, 12 columns x 11 rows.
// apps/native/assets/kenney_tiny-town/Tilemap/tilemap_packed.png
const TILE_SOURCE_SIZE = 16;
const SHEET_COLUMNS = 12;

// Indices picked by eye from Preview.png -- Kenney ships no names for these,
// so treat this as a starting point and adjust by comparing against Preview.png.
const TILE = {
	grass: 0,
	grassEdge: 2,
	grassFlower: 1,
	path: 12,
	treeBush: 5,
	treeRound: 3,
} as const;

const DEFAULT_MAP: number[][] = 
[
[TILE.treeRound, TILE.grass, TILE.grass, TILE.grass, TILE.grass, TILE.treeBush],
[TILE.grass, TILE.grassFlower, TILE.grass, TILE.path, TILE.grass, TILE.grass],
[TILE.grass, TILE.grass, TILE.grass, TILE.path, TILE.grass, TILE.grassFlower],
[TILE.grass, TILE.grassFlower, TILE.grass, TILE.path, TILE.grass, TILE.grass],
[TILE.treeBush, TILE.grass, TILE.grass, TILE.path, TILE.grass, TILE.treeRound],
];

export interface TileWorldProps {
	map?: number[][];
	/** Upscale factor applied to the 16x16 source tiles for on-screen size. */
	scale?: number;
}

export function TileWorld({ map = DEFAULT_MAP, scale = 3 }: TileWorldProps) {
	const tilemap = useImage(
		require("../../assets/kenney_tiny-town/Tilemap/tilemap_packed.png")
	);

	const destTileSize = TILE_SOURCE_SIZE * scale;
	const rows = map.length;
	const columns = map[0]?.length ?? 0;

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

	if (!tilemap) {
		return null;
	}

	const width = columns * destTileSize;
	const height = rows * destTileSize;

	return (
		<View style={{ height, width }}>
			<Canvas style={{ height, width }}>
				<Atlas
					image={tilemap}
					sampling={{ filter: FilterMode.Nearest }}
					sprites={sprites}
					transforms={transforms}
				/>
			</Canvas>
		</View>
	);
}
