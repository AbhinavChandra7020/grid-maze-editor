import { useState } from 'react';
import type { CellValue, Position } from '@/types';
import { exportToPython, exportToJSON, downloadFile, exportCanvasToPNG, copyToClipboard } from '@/utils/exportUtils';

interface ExportPanelProps {
  grid: CellValue[][];
  startPos: Position | null;
  goalPos: Position | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function ExportPanel({ grid, startPos, goalPos, canvasRef }: ExportPanelProps) {
  const [invertValues, setInvertValues] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportPython = () => {
    const code = exportToPython(grid, startPos, goalPos, invertValues);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(code, `maze_${timestamp}.py`, 'text/plain');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(grid, startPos, goalPos, invertValues);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(json, `maze_${timestamp}.json`, 'application/json');
  };

  const handleExportPNG = () => {
    if (canvasRef.current) {
      const timestamp = new Date().toISOString().split('T')[0];
      exportCanvasToPNG(canvasRef.current, `maze_${timestamp}.png`);
    }
  };

  const handleCopyPython = async () => {
    const code = exportToPython(grid, startPos, goalPos, invertValues);
    const success = await copyToClipboard(code);
    
    if (success) {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'success':
        return '✓ Copied!';
      case 'error':
        return '✗ Failed';
      default:
        return 'Copy Code';
    }
  };

  const getCopyButtonClass = () => {
    switch (copyStatus) {
      case 'success':
        return 'px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium';
      case 'error':
        return 'px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium';
      default:
        return 'px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Export Maze</h2>

      {/* Invert values option */}
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={invertValues}
            onChange={(e) => setInvertValues(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            Invert values on export (swap 0↔1)
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Current: 0=wall, 1=walkable → Export as: {invertValues ? '1=wall, 0=walkable' : '0=wall, 1=walkable'}
        </p>
      </div>

      {/* Export buttons */}
      <div className="space-y-3">
        {/* Python Export */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Python/NumPy</h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportPython}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Download .py
            </button>
            <button
              onClick={handleCopyPython}
              disabled={copyStatus !== 'idle'}
              className={getCopyButtonClass()}
            >
              {getCopyButtonText()}
            </button>
          </div>
        </div>

        {/* JSON Export */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">JSON Format</h3>
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Download .json
          </button>
        </div>

        {/* PNG Export */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Image (PNG)</h3>
          <button
            onClick={handleExportPNG}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Download .png
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Python export includes start/goal positions ready for your RL environment setup.
        </p>
      </div>

      {/* Copy error fallback message */}
      {copyStatus === 'error' && (
        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
          <p className="text-xs text-red-700">
            Copy failed. Try downloading the file instead.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExportPanel;