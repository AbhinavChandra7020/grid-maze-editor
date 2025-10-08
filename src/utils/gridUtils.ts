import type { CellValue, GridSize, Position } from '@/types';

export function createEmptyGrid(size: GridSize): CellValue[][] {
    const grid: CellValue[][] = [];
    
    for (let row = 0; row < size.rows; row++) {
        const newRow: CellValue[] = [];
        for (let col = 0; col < size.cols; col++) {
            newRow.push(1);
        }
        grid.push(newRow);
    }
    
    return grid;
}

export function createFullWallGrid(size: GridSize): CellValue[][] {
    const grid: CellValue[][] = [];
    
    for (let row = 0; row < size.rows; row++) {
        const newRow: CellValue[] = [];
        for (let col = 0; col < size.cols; col++) {
            newRow.push(0);
        }
        grid.push(newRow);
    }
    
    return grid;
}

export function isValidPosition(pos: Position, size: GridSize): boolean {
    return pos.row >= 0 && pos.row < size.rows && 
           pos.col >= 0 && pos.col < size.cols;
}

export function arePositionsDifferent(pos1: Position | null, pos2: Position | null): boolean {
    if (!pos1 || !pos2) return true;
    return pos1.row !== pos2.row || pos1.col !== pos2.col;
}

/**
 * Updates a single cell in the grid without mutating the original
 * This prevents unnecessary re-renders and maintains immutability
 */
export function updateCell(
    grid: CellValue[][], 
    row: number, 
    col: number, 
    value: CellValue
): CellValue[][] {
    return grid.map((r, rowIndex) =>
        r.map((cell, colIndex) =>
            rowIndex === row && colIndex === col ? value : cell
        )
    );
}

/**
 * Validates if a grid size is within acceptable bounds
 */
export function isValidGridSize(rows: number, cols: number): boolean {
    return rows >= 5 && rows <= 40 && cols >= 5 && cols <= 40;
}