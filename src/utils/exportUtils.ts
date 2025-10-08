import type { CellValue, Position } from '@/types';

/**
 * Generates Python code with NumPy array format
 */
export function exportToPython(
  grid: CellValue[][], 
  startPos: Position | null, 
  goalPos: Position | null,
  invertValues: boolean = false
): string {
  const processedGrid = invertValues 
    ? grid.map(row => row.map(cell => cell === 0 ? 1 : 0))
    : grid;

  const rows = processedGrid.map(row => 
    '        [' + row.join(', ') + ']'
  ).join(',\n');

  const code = `import numpy as np

# Maze configuration
# ${invertValues ? '1' : '0'} = wall (obstacle)
# ${invertValues ? '0' : '1'} = walkable path

maze = np.array([
${rows}
])

# Start and goal positions (row, col)
start_pos = ${startPos ? `[${startPos.row}, ${startPos.col}]` : 'None  # Not set'}
goal_pos = ${goalPos ? `[${goalPos.row}, ${goalPos.col}]` : 'None  # Not set'}

# Grid dimensions
rows, cols = maze.shape
print(f"Maze size: {rows}x{cols}")
print(f"Start: {start_pos}")
print(f"Goal: {goal_pos}")
`;

  return code;
}

/**
 * Generates JSON format
 */
export function exportToJSON(
  grid: CellValue[][], 
  startPos: Position | null, 
  goalPos: Position | null,
  invertValues: boolean = false
): string {
  const processedGrid = invertValues 
    ? grid.map(row => row.map(cell => cell === 0 ? 1 : 0))
    : grid;

  const data = {
    grid: processedGrid,
    startPos: startPos || null,
    goalPos: goalPos || null,
    dimensions: {
      rows: grid.length,
      cols: grid[0]?.length || 0
    },
    metadata: {
      exportedAt: new Date().toISOString(),
      format: 'maze-grid-editor-v1',
      valueMapping: invertValues ? '1=wall, 0=walkable' : '0=wall, 1=walkable'
    }
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Downloads a file to the user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports canvas as PNG image
 */
export function exportCanvasToPNG(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  });
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  }
  
  // Fallback for older browsers or insecure contexts
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    document.body.removeChild(textArea);
    return false;
  }
}