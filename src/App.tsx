import { useState, useRef, useEffect } from 'react';
import type { CellValue, DrawMode, GridSize, Position, ColorTheme } from '@/types';
import { createEmptyGrid, createFullWallGrid, updateCell } from '@/utils/gridUtils';
import { 
  generateRandomMaze, 
  generateMazeDFS, 
  generateMazePrim, 
  generateMazeKruskal, 
  generateMazeBinaryTree 
} from '@/utils/mazeGenerators';
import { createKeyboardHandler } from '@/utils/keyboardShortcuts';
import GridCanvas from '@/components/GridCanvas';
import Toolbar from '@/components/Toolbar';
import ExportPanel from '@/components/ExportPanel';

function App() {
  // Grid data and dimensions
  const [gridSize, setGridSize] = useState<GridSize>({ rows: 10, cols: 10 });
  const [grid, setGrid] = useState<CellValue[][]>(() => createEmptyGrid(gridSize));

  // Special positions
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [goalPos, setGoalPos] = useState<Position | null>(null);

  // Drawing state
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
  const [isPainting, setIsPainting] = useState(false);

  // Visual theme
  const [colors] = useState<ColorTheme>({
    wall: '#000000',
    walkable: '#ffffff',
    start: '#ef4444',
    goal: '#22c55e',
    grid: '#e5e7eb'
  });

  // Canvas ref for export
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Mode shortcuts (no modifiers)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'w':
            setDrawMode('wall');
            e.preventDefault();
            break;
          case 'p':
            setDrawMode('walkable');
            e.preventDefault();
            break;
          case 's':
            setDrawMode('start');
            e.preventDefault();
            break;
          case 'g':
            setDrawMode('goal');
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle cell interaction (click or drag)
  const handleCellInteract = (row: number, col: number) => {
    if (drawMode === 'start') {
      setStartPos({ row, col });
    } else if (drawMode === 'goal') {
      setGoalPos({ row, col });
    } else if (drawMode === 'wall') {
      setGrid(updateCell(grid, row, col, 0));
    } else if (drawMode === 'walkable') {
      setGrid(updateCell(grid, row, col, 1));
    }
  };

  // Handle right-click (always makes cell walkable)
  const handleCellRightClick = (row: number, col: number) => {
    setGrid(updateCell(grid, row, col, 1));
  };

  const handlePaintStart = () => {
    setIsPainting(true);
  };

  const handlePaintEnd = () => {
    setIsPainting(false);
  };

  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
    setGrid(createEmptyGrid(newSize));
    setStartPos(null);
    setGoalPos(null);
  };

  const handleGenerateRandom = (density: number) => {
    const newGrid = generateRandomMaze(gridSize, density);
    setGrid(newGrid);
    setStartPos(null);
    setGoalPos(null);
  };

  const handleGenerateMaze = (algorithm: 'dfs' | 'prim' | 'kruskal' | 'binary') => {
    let newGrid: CellValue[][];
    
    switch (algorithm) {
      case 'dfs':
        newGrid = generateMazeDFS(gridSize);
        break;
      case 'prim':
        newGrid = generateMazePrim(gridSize);
        break;
      case 'kruskal':
        newGrid = generateMazeKruskal(gridSize);
        break;
      case 'binary':
        newGrid = generateMazeBinaryTree(gridSize);
        break;
    }
    
    setGrid(newGrid);
    setStartPos(null);
    setGoalPos(null);
  };

  const handleClearGrid = () => {
    setGrid(createEmptyGrid(gridSize));
    setStartPos(null);
    setGoalPos(null);
  };

  const handleFillWalls = () => {
    setGrid(createFullWallGrid(gridSize));
    setStartPos(null);
    setGoalPos(null);
  };

  const handleClearMarkers = () => {
    setStartPos(null);
    setGoalPos(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Maze Grid Editor for RL
      </h1>
      
      <div className="max-w-6xl mx-auto">
        {/* Debug info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-around text-sm">
            <span><strong>Grid:</strong> {gridSize.rows}×{gridSize.cols}</span>
            <span><strong>Mode:</strong> {drawMode}</span>
            <span><strong>Start:</strong> {startPos ? `[${startPos.row}, ${startPos.col}]` : 'Not set'}</span>
            <span><strong>Goal:</strong> {goalPos ? `[${goalPos.row}, ${goalPos.col}]` : 'Not set'}</span>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Left sidebar - Toolbar */}
          <div className="w-64 flex-shrink-0">
            <Toolbar 
              drawMode={drawMode}
              gridSize={gridSize}
              onModeChange={setDrawMode}
              onGridSizeChange={handleGridSizeChange}
              onGenerateRandom={handleGenerateRandom}
              onGenerateMaze={handleGenerateMaze}
              onClearGrid={handleClearGrid}
              onFillWalls={handleFillWalls}
              onClearMarkers={handleClearMarkers}
            />
          </div>

          {/* Right side - Canvas and Export Panel */}
          <div className="flex-1 flex flex-col gap-6">
            <GridCanvas
              ref={canvasRef}
              grid={grid}
              startPos={startPos}
              goalPos={goalPos}
              colors={colors}
              isPainting={isPainting}
              onCellInteract={handleCellInteract}
              onCellRightClick={handleCellRightClick}
              onPaintStart={handlePaintStart}
              onPaintEnd={handlePaintEnd}
            />

            <ExportPanel
              grid={grid}
              startPos={startPos}
              goalPos={goalPos}
              canvasRef={canvasRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;