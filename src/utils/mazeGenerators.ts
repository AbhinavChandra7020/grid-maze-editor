import type { CellValue, GridSize, Position } from '@/types';


export function generateMazeDFS(size: GridSize): CellValue[][] {
  const rows = size.rows % 2 === 0 ? size.rows - 1 : size.rows;
  const cols = size.cols % 2 === 0 ? size.cols - 1 : size.cols;
  
  const grid: CellValue[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: CellValue[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(0);
    }
    grid.push(newRow);
  }
  
  const getUnvisitedNeighbors = (row: number, col: number, visited: boolean[][]): Position[] => {
    const neighbors: Position[] = [];
    const directions = [
      { row: -2, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 }
    ];
    
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols && 
          !visited[newRow][newCol]) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }
    
    return neighbors;
  };
  
  const removeWallBetween = (from: Position, to: Position) => {
    const wallRow = Math.floor((from.row + to.row) / 2);
    const wallCol = Math.floor((from.col + to.col) / 2);
    grid[wallRow][wallCol] = 1;
  };
  
  const visited: boolean[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: boolean[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(false);
    }
    visited.push(newRow);
  }
  
  const stack: Position[] = [];
  const startRow = 0;
  const startCol = 0;
  
  grid[startRow][startCol] = 1;
  visited[startRow][startCol] = true;
  stack.push({ row: startRow, col: startCol });
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current.row, current.col, visited);
    
    if (neighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const next = neighbors[randomIndex];
      
      grid[next.row][next.col] = 1;
      visited[next.row][next.col] = true;
      removeWallBetween(current, next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  
  return grid;
}


export function generateMazePrim(size: GridSize): CellValue[][] {
  const rows = size.rows % 2 === 0 ? size.rows - 1 : size.rows;
  const cols = size.cols % 2 === 0 ? size.cols - 1 : size.cols;

  const grid: CellValue[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: CellValue[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(0);
    }
    grid.push(newRow);
  }

  const visited: boolean[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: boolean[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(false);
    }
    visited.push(newRow);
  }

  const frontiers: Position[] = [];

  const addFrontiers = (row: number, col: number) => {
    const directions = [
      { row: -2, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 }
    ];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols && 
          !visited[newRow][newCol]) {
        frontiers.push({ row: newRow, col: newCol });
        visited[newRow][newCol] = true;
      }
    }
  };

  const getNeighborInMaze = (row: number, col: number): Position[] => {
    const neighbors: Position[] = [];
    const directions = [
      { row: -2, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 }
    ];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols && 
          grid[newRow][newCol] === 1) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  };

  const startRow = 0;
  const startCol = 0;
  grid[startRow][startCol] = 1;
  visited[startRow][startCol] = true;
  addFrontiers(startRow, startCol);

  while (frontiers.length > 0) {
    const randomIndex = Math.floor(Math.random() * frontiers.length);
    const current = frontiers[randomIndex];
    frontiers.splice(randomIndex, 1);

    const neighbors = getNeighborInMaze(current.row, current.col);

    if (neighbors.length > 0) {
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[current.row][current.col] = 1;
      const wallRow = Math.floor((current.row + neighbor.row) / 2);
      const wallCol = Math.floor((current.col + neighbor.col) / 2);
      grid[wallRow][wallCol] = 1;
      addFrontiers(current.row, current.col);
    }
  }

  return grid;
}


export function generateMazeKruskal(size: GridSize): CellValue[][] {
  const rows = size.rows % 2 === 0 ? size.rows - 1 : size.rows;
  const cols = size.cols % 2 === 0 ? size.cols - 1 : size.cols;

  const grid: CellValue[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: CellValue[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(0);
    }
    grid.push(newRow);
  }

  const parent: Map<string, string> = new Map();
  
  const find = (cell: string): string => {
    if (parent.get(cell) !== cell) {
      parent.set(cell, find(parent.get(cell)!));
    }
    return parent.get(cell)!;
  };

  const union = (cell1: string, cell2: string) => {
    const root1 = find(cell1);
    const root2 = find(cell2);
    if (root1 !== root2) {
      parent.set(root2, root1);
    }
  };

  const cells: Position[] = [];
  for (let row = 0; row < rows; row += 2) {
    for (let col = 0; col < cols; col += 2) {
      const key = `${row},${col}`;
      parent.set(key, key);
      cells.push({ row, col });
      grid[row][col] = 1;
    }
  }

  interface Wall {
    from: Position;
    to: Position;
  }
  
  const walls: Wall[] = [];
  for (let row = 0; row < rows; row += 2) {
    for (let col = 0; col < cols; col += 2) {
      if (col + 2 < cols) {
        walls.push({
          from: { row, col },
          to: { row, col: col + 2 }
        });
      }
      if (row + 2 < rows) {
        walls.push({
          from: { row, col },
          to: { row: row + 2, col }
        });
      }
    }
  }

  for (let i = walls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [walls[i], walls[j]] = [walls[j], walls[i]];
  }

  for (const wall of walls) {
    const key1 = `${wall.from.row},${wall.from.col}`;
    const key2 = `${wall.to.row},${wall.to.col}`;

    if (find(key1) !== find(key2)) {
      const wallRow = Math.floor((wall.from.row + wall.to.row) / 2);
      const wallCol = Math.floor((wall.from.col + wall.to.col) / 2);
      grid[wallRow][wallCol] = 1;
      union(key1, key2);
    }
  }

  return grid;
}


export function generateMazeBinaryTree(size: GridSize): CellValue[][] {
  const rows = size.rows % 2 === 0 ? size.rows - 1 : size.rows;
  const cols = size.cols % 2 === 0 ? size.cols - 1 : size.cols;

  const grid: CellValue[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: CellValue[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(0);
    }
    grid.push(newRow);
  }

  for (let row = 0; row < rows; row += 2) {
    for (let col = 0; col < cols; col += 2) {
      grid[row][col] = 1;

      const neighbors: Position[] = [];

      if (row > 0) {
        neighbors.push({ row: row - 2, col });
      }

      if (col + 2 < cols) {
        neighbors.push({ row, col: col + 2 });
      }

      if (neighbors.length > 0) {
        const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        const wallRow = Math.floor((row + neighbor.row) / 2);
        const wallCol = Math.floor((col + neighbor.col) / 2);
        grid[wallRow][wallCol] = 1;
      }
    }
  }

  return grid;
}


export function generateRandomMaze(size: GridSize, wallDensity: number = 0.3): CellValue[][] {
  const grid: CellValue[][] = [];

  for (let row = 0; row < size.rows; row++) {
    const newRow: CellValue[] = [];
    for (let col = 0; col < size.cols; col++) {
      const random = Math.random();
      const cellValue = random < wallDensity ? 0 : 1;
      newRow.push(cellValue);
    }
    grid.push(newRow);
  }

  return grid;
}