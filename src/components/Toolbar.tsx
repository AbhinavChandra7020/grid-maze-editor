import type { DrawMode, GridSize } from '@/types';
import { useState } from 'react';
import { isValidGridSize } from '@/utils/gridUtils';

interface ToolbarProps {
  drawMode: DrawMode;
  gridSize: GridSize;
  onModeChange: (mode: DrawMode) => void;
  onGridSizeChange: (size: GridSize) => void;
  onGenerateRandom: (density: number) => void;
  onGenerateMaze: (algorithm: 'dfs' | 'prim' | 'kruskal' | 'binary') => void;
  onClearGrid: () => void;
  onFillWalls: () => void;
  onClearMarkers: () => void;
}

function Toolbar({ 
  drawMode, 
  gridSize, 
  onModeChange, 
  onGridSizeChange,
  onGenerateRandom,
  onGenerateMaze,
  onClearGrid,
  onFillWalls,
  onClearMarkers
}: ToolbarProps) {
  const [customRows, setCustomRows] = useState(gridSize.rows.toString());
  const [customCols, setCustomCols] = useState(gridSize.cols.toString());
  const [wallDensity, setWallDensity] = useState(0.3);

  const modes: { value: DrawMode; label: string; hint: string }[] = [
    { value: 'wall', label: 'Draw Wall', hint: 'W' },
    { value: 'walkable', label: 'Draw Walkable', hint: 'P' },
    { value: 'start', label: 'Set Start', hint: 'S' },
    { value: 'goal', label: 'Set Goal', hint: 'G' },
  ];

  const presetSizes = [
    { rows: 5, cols: 5, label: '5x5' },
    { rows: 10, cols: 10, label: '10x10' },
    { rows: 15, cols: 15, label: '15x15' },
    { rows: 20, cols: 20, label: '20x20' },
    { rows: 30, cols: 30, label: '30x30' },
    { rows: 40, cols: 40, label: '40x40' },
  ];

  const handlePresetSize = (size: GridSize) => {
    setCustomRows(size.rows.toString());
    setCustomCols(size.cols.toString());
    onGridSizeChange(size);
  };

  const handleRowsChange = (value: string) => {
    if (value === '') {
      setCustomRows('');
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num) && num >= 5 && num <= 40) {
      setCustomRows(value);
    }
  };

  const handleColsChange = (value: string) => {
    if (value === '') {
      setCustomCols('');
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num) && num >= 5 && num <= 40) {
      setCustomCols(value);
    }
  };

  const handleCustomSize = () => {
    const rows = parseInt(customRows);
    const cols = parseInt(customCols);

    if (isValidGridSize(rows, cols)) {
      onGridSizeChange({ rows, cols });
    } else {
      alert('Grid size must be between 5 and 40 for both dimensions');
      setCustomRows(gridSize.rows.toString());
      setCustomCols(gridSize.cols.toString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Drawing Mode</h2>
        <div className="space-y-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onModeChange(mode.value)}
              className={`w-full px-4 py-3 rounded-lg font-medium flex justify-between items-center ${
                drawMode === mode.value
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{mode.label}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                drawMode === mode.value ? 'bg-slate-800' : 'bg-slate-200'
              }`}>
                {mode.hint}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Right-click: Make walkable
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Grid Size</h2>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presetSizes.map((size) => (
            <button
              key={size.label}
              onClick={() => handlePresetSize(size)}
              className={`px-3 py-2 rounded font-medium text-sm ${
                gridSize.rows === size.rows && gridSize.cols === size.cols
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rows (5-40)
            </label>
            <input
              type="number"
              min="5"
              max="40"
              value={customRows}
              onChange={(e) => handleRowsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Columns (5-40)
            </label>
            <input
              type="number"
              min="5"
              max="40"
              value={customCols}
              onChange={(e) => handleColsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <button
            onClick={handleCustomSize}
            disabled={customRows === '' || customCols === ''}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply Custom Size
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Generate Maze</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Wall Density: {Math.round(wallDensity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={wallDensity}
              onChange={(e) => setWallDensity(parseFloat(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          <button
            onClick={() => onGenerateRandom(wallDensity)}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            Random Maze
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Perfect Mazes</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onGenerateMaze('dfs')}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded font-medium hover:bg-slate-700 text-sm"
            >
              Long Corridors
            </button>
            
            <button
              onClick={() => onGenerateMaze('prim')}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded font-medium hover:bg-slate-700 text-sm"
            >
              Branching
            </button>
            
            <button
              onClick={() => onGenerateMaze('kruskal')}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded font-medium hover:bg-slate-700 text-sm"
            >
              Uniform
            </button>
            
            <button
              onClick={() => onGenerateMaze('binary')}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded font-medium hover:bg-slate-700 text-sm"
            >
              Fast
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            All guarantee solvable paths
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Utility Actions</h2>
        
        <div className="space-y-2">
          <button
            onClick={onClearGrid}
            className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700"
          >
            Clear Grid (All Walkable)
          </button>
          
          <button
            onClick={onFillWalls}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800"
          >
            Fill All Walls
          </button>
          
          <button
            onClick={onClearMarkers}
            className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700"
          >
            Clear Start/Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;