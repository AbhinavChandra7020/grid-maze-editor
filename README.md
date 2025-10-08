# Maze Grid Editor

A web-based maze editor designed for reinforcement learning research and experimentation. Create, customize, and export maze environments with an intuitive visual interface. This is a feature of another application that will be used to train RL mazes.

## Installation

### Prerequisites
- Node.js 16+ and npm (or yarn/pnpm)
- Modern web browser with HTML5 Canvas support

### Setup

1. **Clone or download the repository**
```bash
git clone <your-repo-url>
cd maze-grid-editor
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory, ready for deployment.

## Tech Stack

Built with modern web technologies for performance and reliability:

- **React 18+**: Component-based UI with hooks
- **TypeScript**: Type-safe code with full IntelliSense support
- **HTML5 Canvas**: Hardware-accelerated rendering
- **Immutable State**: Predictable grid updates and history

## Features

### Interactive Grid Canvas
- **Visual Maze Design**: Draw walls and walkable paths with intuitive click-and-drag painting
- **Dual-Click Modes**: Left-click to paint, right-click to create walkable spaces
- **Start/Goal Markers**: Set agent spawn and target positions for pathfinding tasks
- **Responsive Canvas**: Automatically scales to accommodate grids from 5×5 to 40×40

### Maze Generation Algorithms
Generate perfect mazes (guaranteed single solution) using industry-standard algorithms:

- **DFS (Depth-First Search)**: Creates long, winding corridors ideal for exploration tasks
- **Prim's Algorithm**: Produces branching mazes with multiple path options
- **Kruskal's Algorithm**: Generates uniform maze structures with balanced difficulty
- **Binary Tree**: Fast generation for large grids with characteristic diagonal bias
- **Random Generation**: Customizable wall density (10-50%) for irregular environments

### Professional Export Options

Export your mazes in multiple formats optimized for RL frameworks:

#### Python/NumPy
```python
import numpy as np

# Maze configuration
# 0 = wall (obstacle)
# 1 = walkable path

maze = np.array([
    [1, 1, 0, 1, 1],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    # ...
])

start_pos = [0, 0]
goal_pos = [4, 4]
```

#### JSON Format
```json
{
  "grid": [[1, 1, 0], [0, 1, 1]],
  "startPos": {"row": 0, "col": 0},
  "goalPos": {"row": 1, "col": 2},
  "dimensions": {"rows": 2, "cols": 3},
  "metadata": {
    "exportedAt": "2024-10-08T12:00:00.000Z",
    "format": "maze-grid-editor-v1",
    "valueMapping": "0=wall, 1=walkable"
  }
}
```

#### PNG Image
Export high-quality images for documentation, papers, or visual analysis.

### Value Inversion
Toggle between `0=wall, 1=walkable` and `1=wall, 0=walkable` encoding to match your RL framework's conventions (OpenAI Gym, RLlib, etc.).

## Use Cases

- **Reinforcement Learning Research**: Generate training environments for pathfinding agents
- **Algorithm Testing**: Create benchmark mazes for A*, Dijkstra, or learned policies
- **Curriculum Learning**: Design progressively challenging maze sequences
- **Academic Publications**: Export publication-ready maze visualizations
- **Educational Demonstrations**: Teach pathfinding concepts with custom examples

## Keyboard Shortcuts

Streamline your workflow with keyboard controls:

- `Q` - Draw walls
- `E` - Draw walkable paths  
- `S` - Set start position
- `G` - Set goal position

## Grid Operations

- **Clear Grid**: Reset to all walkable spaces
- **Fill Walls**: Convert entire grid to walls
- **Clear Markers**: Remove start/goal positions
- **Custom Dimensions**: Specify exact grid size (5-40 rows/cols)

## Technical Specifications

### Grid Properties
- **Dimensions**: 5×5 to 40×40 cells
- **Cell Values**: Binary (0 = obstacle, 1 = walkable)
- **Coordinate System**: Row-major indexing, top-left origin
- **Perfect Mazes**: All generated mazes guarantee solvability

### Export Formats
- **Python**: NumPy-compatible array syntax
- **JSON**: Structured data with metadata
- **PNG**: Rasterized visual representation

### Browser Compatibility
- Modern browsers with HTML5 Canvas support
- Clipboard API for code copying (fallback included)
- No external dependencies required at runtime

## Integration Examples

### OpenAI Gym Environment
```python
import numpy as np
import gym

# Import your exported maze
maze = np.array([...])  # From exported .py file
start_pos = [0, 0]
goal_pos = [9, 9]

class MazeEnv(gym.Env):
    def __init__(self):
        self.maze = maze
        self.start = start_pos
        self.goal = goal_pos
        # Define action/observation spaces
        # ...
```

### Custom RL Framework
```python
# Load JSON export
import json
with open('maze_2024-10-08.json', 'r') as f:
    data = json.load(f)

grid = np.array(data['grid'])
start = (data['startPos']['row'], data['startPos']['col'])
goal = (data['goalPos']['row'], data['goalPos']['col'])
```
---

Thank you for checking this project out if it was useful or helpful to you in any way then I have succeeded in doing what I wanted to. It started out as a project for me to build custom mazes for my RLtraining for a big maze solver so if you are looking for the same thing then I am glad to have helped!

