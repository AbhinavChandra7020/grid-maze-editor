import { forwardRef, useRef, useEffect, useImperativeHandle, useMemo } from 'react';
import type { CellValue, Position, ColorTheme } from '@/types';

interface GridCanvasProps {
  grid: CellValue[][];
  startPos: Position | null;
  goalPos: Position | null;
  colors: ColorTheme;
  isPainting: boolean;
  onCellInteract: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onPaintStart: () => void;
  onPaintEnd: () => void;
}

const GridCanvas = forwardRef<HTMLCanvasElement, GridCanvasProps>(({ 
  grid, 
  startPos, 
  goalPos, 
  colors, 
  isPainting,
  onCellInteract,
  onCellRightClick,
  onPaintStart,
  onPaintEnd 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPaintedCell = useRef<string | null>(null);
  const isRightClick = useRef<boolean>(false);

  // Expose canvas ref to parent
  useImperativeHandle(ref, () => canvasRef.current!);

  // Memoize dimensions to prevent unnecessary recalculations
  const dimensions = useMemo(() => {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    const maxCanvasSize = 700;
    const cellSize = Math.floor(maxCanvasSize / Math.max(rows, cols));
    const canvasWidth = cols * cellSize;
    const canvasHeight = rows * cellSize;
    
    return { rows, cols, cellSize, canvasWidth, canvasHeight };
  }, [grid.length, grid[0]?.length]);

  // Handle global mouse up to fix painting state getting stuck
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPainting) {
        onPaintEnd();
        lastPaintedCell.current = null;
        isRightClick.current = false;
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isPainting, onPaintEnd]);

  // Draw the grid whenever it changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { rows, cols, cellSize, canvasWidth, canvasHeight } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw each cell
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;

        // Fill cell
        ctx.fillStyle = grid[row][col] === 0 ? colors.wall : colors.walkable;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Draw grid lines
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    // Draw start position
    if (startPos) {
      const x = startPos.col * cellSize + cellSize / 2;
      const y = startPos.row * cellSize + cellSize / 2;
      const radius = Math.max(cellSize / 3, 3);
      
      ctx.fillStyle = colors.start;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw goal position
    if (goalPos) {
      const x = goalPos.col * cellSize + cellSize / 2;
      const y = goalPos.row * cellSize + cellSize / 2;
      const radius = Math.max(cellSize / 3, 3);
      
      ctx.fillStyle = colors.goal;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [grid, startPos, goalPos, colors, dimensions]);

  // Get cell from mouse position
  const getCellFromMouse = (e: React.MouseEvent<HTMLCanvasElement>): Position | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { rows, cols, cellSize } = dimensions;
    const col = Math.floor(mouseX / cellSize);
    const row = Math.floor(mouseY / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      return { row, col };
    }
    return null;
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent context menu on right-click drag
    
    const cell = getCellFromMouse(e);
    if (cell) {
      // Check which button was pressed (0 = left, 2 = right)
      isRightClick.current = e.button === 2;
      
      onPaintStart();
      lastPaintedCell.current = `${cell.row},${cell.col}`;
      
      // Use appropriate handler based on button
      if (isRightClick.current) {
        onCellRightClick(cell.row, cell.col);
      } else {
        onCellInteract(cell.row, cell.col);
      }
    }
  };

  // Handle mouse move (drag painting)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;

    const cell = getCellFromMouse(e);
    if (cell) {
      const cellKey = `${cell.row},${cell.col}`;
      if (cellKey !== lastPaintedCell.current) {
        lastPaintedCell.current = cellKey;
        
        // Use appropriate handler based on which button started the drag
        if (isRightClick.current) {
          onCellRightClick(cell.row, cell.col);
        } else {
          onCellInteract(cell.row, cell.col);
        }
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    onPaintEnd();
    lastPaintedCell.current = null;
    isRightClick.current = false;
  };

  // Handle mouse leaving canvas
  const handleMouseLeave = () => {
    if (isPainting) {
      onPaintEnd();
      lastPaintedCell.current = null;
      isRightClick.current = false;
    }
  };

  // Handle right-click context menu (prevent default)
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-start bg-white rounded-lg shadow-md p-6">
      <canvas
        ref={canvasRef}
        width={dimensions.canvasWidth}
        height={dimensions.canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        className="border-2 border-gray-400 cursor-crosshair"
        style={{ touchAction: 'none' }} // Improves mobile experience
      />
    </div>
  );
});

GridCanvas.displayName = 'GridCanvas';

export default GridCanvas;