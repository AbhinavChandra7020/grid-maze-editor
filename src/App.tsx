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
import GridCanvas from '@/components/GridCanvas';
import Toolbar from '@/components/Toolbar';
import ExportPanel from '@/components/ExportPanel';

function App() {
  const [gridSize, setGridSize] = useState<GridSize>({ rows: 10, cols: 10 });
  const [grid, setGrid] = useState<CellValue[][]>(() => createEmptyGrid(gridSize));
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [goalPos, setGoalPos] = useState<Position | null>(null);
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
  const [isPainting, setIsPainting] = useState(false);
  const [colors] = useState<ColorTheme>({
    wall: '#000000',
    walkable: '#ffffff',
    start: '#ef4444',
    goal: '#22c55e',
    grid: '#e5e7eb'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

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

  const handleCellRightClick = (row: number, col: number) => {
    setGrid(updateCell(grid, row, col, 1));
  };

  const handlePaintStart = () => setIsPainting(true);
  const handlePaintEnd = () => setIsPainting(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 pl-80">
          Maze Grid Editor
        </h1>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-[320px_1fr] gap-6 h-[calc(100vh-180px)]">
          {/* Left Sidebar - Stacked Panels */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-2">
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

          {/* Right Side - Canvas and Export in Column */}
          <div className="flex flex-col gap-6">
            {/* Canvas Area - Takes up 2/3 height */}
            <div className="flex-[2] min-h-0">
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
            </div>

            {/* Export Panel - Takes up 1/3 height */}
            <div className="flex-[1] min-h-0 flex justify-center">
              <div className="w-full max-w-2xl">
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
      </div>
    </div>
  );
}

export default App;