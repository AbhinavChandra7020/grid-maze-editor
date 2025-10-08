
export type CellValue = 0 | 1;

export type DrawMode = "wall" | "walkable" | "start" | "goal";

export interface Position {
    row: number;
    col: number;
}

export interface GridSize {
    rows: number;
    cols: number;
}

export interface ColorTheme {
    wall: string;
    walkable: string;
    start: string;
    goal: string;
    grid: string;
}

export interface CanvasDimensions {
    rows: number;
    cols: number;
    cellSize: number;
    canvasWidth: number;
    canvasHeight: number;
}