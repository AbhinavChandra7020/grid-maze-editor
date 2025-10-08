import type { DrawMode, GridSize } from '@/types';
import { useState } from 'react';
import { isValidGridSize } from '@/utils/gridUtils';
import { getShortcutLabel } from '@/utils/keyboardShortcuts';

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
    { rows: 5, cols: 5, label: '5×5' },
    { rows: 10, cols: 10, label: '10×10' },
    { rows: 15, cols: 15, label: '15×15' },
    { rows: 20, cols: 20, label: '20×20' },
    { rows: 30, cols: 30, label: '30×30' },
    { rows: 40, cols: 40, label: '40×40' },
  ];

  const handlePresetSize = (size: GridSize) => {
    setCustomRows(size.rows.toString());
    setCustomCols(size.cols.toString());
    onGridSizeChange(size);
  };

  // Real-time validation for rows input
  const handleRowsChange = (value: string) => {
    // Allow empty string for editing
    if (value === '') {
      setCustomRows('');
      return;
    }

    const num = parseInt(value);
    // Only update if valid number and within range
    if (!isNaN(num) && num >= 5 && num <= 40) {
      setCustomRows(value);
    }
  };

  // Real-time validation for columns input
  const handleColsChange = (value: string) => {
    // Allow empty string for editing
    if (value === '') {
      setCustomCols('');
      return;
    }

    const num = parseInt(value);
    // Only update if valid number and within range
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
      // Reset to current valid size
      setCustomRows(gridSize.rows.toString());
      setCustomCols(gridSize.cols.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Drawing Mode Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Drawing Mode</h2>
        <div className="space-y-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onModeChange(mode.value)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${
                drawMode === mode.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{mode.label}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                drawMode === mode.value ? 'bg-blue-600' : 'bg-gray-200'
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

      {/* Grid Size Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Grid Size</h2>
        
        {/* Preset sizes */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presetSizes.map((size) => (
            <button
              key={size.label}
              onClick={() => handlePresetSize(size)}
              className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                gridSize.rows === size.rows && gridSize.cols === size.cols
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>

        {/* Custom size inputs */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomSize}
            disabled={customRows === '' || customCols === ''}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Apply Custom Size
          </button>
        </div>
      </div>

      {/* Generate Maze Section */}
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
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          <button
            onClick={() => onGenerateRandom(wallDensity)}
            className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors shadow-md"
          >
            Random Maze
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Perfect Mazes</span>
            </div>
          </div>

          {/* Algorithm buttons */}
          <div className="space-y-2">
            <button
              onClick={() => onGenerateMaze('dfs')}
              className="w-full px-3 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm"
            >
              DFS (Long Corridors)
            </button>
            
            <button
              onClick={() => onGenerateMaze('prim')}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded font-medium hover:bg-purple-600 transition-colors text-sm"
            >
              Prim's (Branching)
            </button>
            
            <button
              onClick={() => onGenerateMaze('kruskal')}
              className="w-full px-3 py-2 bg-pink-500 text-white rounded font-medium hover:bg-pink-600 transition-colors text-sm"
            >
              Kruskal's (Uniform)
            </button>
            
            <button
              onClick={() => onGenerateMaze('binary')}
              className="w-full px-3 py-2 bg-cyan-500 text-white rounded font-medium hover:bg-cyan-600 transition-colors text-sm"
            >
              Binary Tree (Fast)
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            All guarantee solvable paths
          </p>
        </div>
      </div>

      {/* Utility Actions Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Utility Actions</h2>
        
        <div className="space-y-2">
          <button
            onClick={onClearGrid}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Clear Grid (All Walkable)
          </button>
          
          <button
            onClick={onFillWalls}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Fill All Walls
          </button>
          
          <button
            onClick={onClearMarkers}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Clear Start/Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;