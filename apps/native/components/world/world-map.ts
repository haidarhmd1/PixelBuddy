// Hand-editable world layout for <TileWorld />.
// Each number is a tile index into the Kenney "Tiny Town" packed sheet
// (apps/native/assets/kenney_tiny-town/Tilemap/tilemap_packed.png),
// counted left-to-right, top-to-bottom: index = sheetRow * 12 + sheetColumn.

// Kenney "Tiny Town" packed sheet: 16x16 tiles, no gutters, 12 columns x 11 rows.
// apps/native/assets/kenney_tiny-town/Tilemap/tilemap_packed.png
export const TILE_SOURCE_SIZE = 16;
export const SHEET_COLUMNS = 12;

// Indices picked by eye from Preview.png -- Kenney ships no names for these,
// so treat this as a starting point and adjust by comparing against Preview.png.
export const TILE = {
	grass: 0,
	grassEdge: 2,
	grassFlower: 1,
	path: 12,
	treeBush: 5,
	treeRound: 3,
} as const;

// Tiles the character cannot walk onto.
export const SOLID_TILES: ReadonlySet<number> = new Set([
	TILE.treeBush,
	TILE.treeRound,
]);

export interface TilePosition {
	column: number;
	row: number;
}

// Where the character starts, in tile coordinates (0-based, same as WORLD_MAP).
export const CHARACTER_START: TilePosition = { column: 14, row: 20 };

// True when the position is inside the map and not on a solid tile.
export const isWalkable = (map: number[][], { column, row }: TilePosition) => {
	const tile = map[row]?.[column];
	return tile !== undefined && !SOLID_TILES.has(tile);
};

// Short aliases so the grid below stays readable as a picture.
const GR = TILE.grass;
const FL = TILE.grassFlower;
const PA = TILE.path;
const TR = TILE.treeRound;
const BU = TILE.treeBush;

// One inner array per row (top to bottom), one entry per column (left to right).
// Every row must have the same length. 30 columns x 40 rows.
// biome-ignore format: grid is laid out by hand to mirror the world
export const WORLD_MAP: number[][] = [
	[TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU],
	[BU, GR, GR, GR, GR, FL, GR, GR, GR, GR, GR, GR, BU, GR, PA, GR, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, TR],
	[TR, GR, GR, GR, GR, BU, GR, GR, GR, GR, FL, TR, GR, GR, PA, GR, GR, GR, GR, GR, GR, FL, GR, GR, BU, GR, GR, GR, TR, BU],
	[BU, GR, GR, GR, FL, GR, GR, GR, TR, GR, GR, GR, GR, GR, PA, FL, GR, BU, GR, GR, GR, GR, GR, GR, GR, TR, FL, GR, GR, TR],
	[TR, GR, GR, GR, GR, TR, GR, GR, GR, FL, BU, GR, GR, GR, PA, GR, GR, GR, GR, GR, FL, GR, TR, GR, GR, GR, GR, GR, GR, BU],
	[BU, GR, TR, BU, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, GR, GR, TR, GR, GR, BU, GR, GR, FL, GR, GR, GR, TR],
	[TR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, GR, GR, PA, BU, TR, GR, GR, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, BU],
	[BU, GR, FL, GR, GR, GR, GR, GR, BU, GR, GR, GR, GR, TR, PA, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, BU, GR, TR],
	[TR, BU, GR, GR, GR, GR, GR, FL, GR, GR, TR, GR, GR, GR, PA, GR, GR, GR, FL, GR, BU, GR, GR, GR, GR, GR, GR, TR, GR, BU],
	[BU, FL, GR, GR, GR, GR, GR, TR, GR, GR, GR, GR, FL, BU, PA, GR, GR, GR, GR, GR, GR, GR, GR, FL, TR, GR, GR, GR, GR, TR],
	[TR, GR, GR, GR, TR, GR, BU, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, FL, GR, GR, GR, TR, GR, GR, GR, BU, GR, GR, FL, BU],
	[BU, TR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, PA, GR, GR, GR, TR, GR, GR, GR, FL, GR, GR, GR, GR, GR, GR, TR],
	[TR, GR, GR, GR, GR, FL, GR, GR, GR, GR, GR, BU, GR, GR, PA, TR, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, BU],
	[BU, GR, GR, GR, BU, GR, GR, GR, GR, GR, FL, GR, TR, GR, PA, GR, GR, GR, GR, GR, GR, FL, GR, BU, GR, GR, GR, GR, GR, TR],
	[TR, GR, GR, GR, FL, GR, GR, GR, GR, TR, GR, GR, GR, GR, PA, FL, BU, GR, GR, GR, GR, GR, GR, GR, GR, GR, TR, GR, GR, BU],
	[BU, GR, GR, GR, GR, GR, TR, GR, GR, BU, GR, GR, GR, GR, PA, GR, GR, GR, GR, GR, FL, GR, GR, TR, GR, GR, GR, GR, BU, TR],
	[TR, GR, BU, TR, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, GR, GR, GR, TR, BU, GR, GR, GR, FL, GR, GR, GR, BU],
	[BU, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, GR, GR, PA, GR, GR, TR, GR, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, TR],
	[TR, GR, FL, GR, GR, GR, GR, BU, GR, GR, GR, GR, GR, FL, PA, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, BU, GR, GR, BU],
	[BU, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, TR, GR, GR, PA, GR, GR, GR, FL, BU, GR, GR, GR, GR, GR, GR, GR, GR, TR, TR],
	[TR, FL, GR, GR, GR, GR, GR, GR, TR, GR, GR, GR, BU, GR, PA, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, TR, GR, GR, GR, BU],
	[BU, GR, GR, GR, GR, TR, FL, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, FL, GR, GR, GR, GR, TR, GR, BU, GR, GR, GR, FL, TR],
	[TR, GR, TR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, PA, GR, GR, BU, GR, TR, GR, GR, FL, GR, GR, GR, GR, GR, GR, BU],
	[BU, GR, GR, GR, GR, FL, GR, GR, GR, GR, BU, GR, GR, GR, PA, GR, TR, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, TR],
	[TR, GR, GR, BU, GR, GR, GR, GR, GR, GR, FL, GR, GR, TR, PA, GR, GR, GR, GR, GR, GR, FL, BU, GR, GR, GR, GR, GR, GR, BU],
	[BU, GR, GR, GR, FL, GR, GR, GR, GR, GR, TR, GR, GR, GR, PA, BU, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, TR, GR, TR],
	[TR, GR, GR, GR, GR, GR, GR, TR, BU, FL, GR, GR, GR, GR, PA, GR, GR, GR, GR, GR, FL, GR, GR, GR, TR, GR, GR, BU, GR, BU],
	[BU, BU, GR, FL, TR, GR, GR, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, GR, GR, GR, BU, TR, GR, GR, GR, FL, GR, GR, GR, TR],
	[TR, TR, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, GR, BU, PA, GR, GR, GR, TR, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, BU],
	[BU, GR, FL, GR, GR, GR, BU, GR, GR, GR, GR, GR, GR, FL, PA, TR, GR, GR, GR, GR, GR, GR, GR, GR, FL, BU, GR, GR, GR, TR],
	[TR, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, GR, TR, GR, PA, GR, GR, GR, BU, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, BU],
	[BU, FL, GR, GR, GR, GR, GR, GR, GR, TR, GR, BU, FL, GR, PA, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, TR, GR, GR, TR],
	[TR, GR, GR, GR, BU, GR, TR, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, FL, GR, GR, GR, GR, GR, TR, GR, GR, GR, GR, FL, BU],
	[BU, GR, GR, TR, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, PA, GR, BU, GR, GR, GR, TR, GR, FL, GR, GR, GR, GR, GR, GR, TR],
	[TR, GR, GR, GR, GR, FL, GR, GR, GR, BU, GR, GR, GR, GR, PA, GR, FL, TR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, BU, BU],
	[BU, GR, BU, GR, GR, GR, GR, GR, GR, GR, FL, GR, GR, GR, PA, GR, GR, GR, GR, GR, GR, BU, GR, GR, GR, GR, GR, GR, GR, TR],
	[TR, GR, GR, GR, FL, GR, GR, GR, GR, GR, GR, TR, GR, GR, PA, FL, GR, GR, GR, GR, GR, GR, GR, GR, GR, GR, FL, GR, TR, BU],
	[BU, GR, GR, GR, GR, GR, GR, BU, TR, FL, GR, GR, GR, GR, PA, GR, GR, GR, GR, GR, FL, GR, GR, GR, GR, TR, BU, GR, GR, TR],
	[TR, GR, GR, FL, GR, TR, GR, GR, GR, GR, GR, GR, GR, GR, PA, GR, GR, GR, GR, BU, GR, GR, TR, GR, GR, FL, GR, GR, GR, BU],
	[BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR, BU, TR],
];
