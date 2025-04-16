# Immigration Roadmap Explorer

A Next.js web application for visualizing and exploring different immigration pathways, from entry to citizenship.

## Overview

This application connects to a Python backend (using the existing `roadmap.py` script) and SQL database (from `data.sql`) to visualize immigration pathways. Users can:

- Explore the immigration roadmap as an interactive graph
- Select start and end points to find possible paths
- Compare different paths based on time, cost, and number of steps
- View detailed information about each step in the immigration process

## Features

- Interactive graph visualization of the immigration roadmap
- Path finder to discover routes between different immigration statuses
- Detailed metrics for each path (time, cost, steps)
- Subgraph support for exploring nested pathways (e.g., study options)
- Multiple view options (graph or list view)

## Prerequisites

- Node.js 14.x or higher
- Python 3.6 or higher
- SQLite3

## Project Structure

```
roadmap-frontend/
├── components/         # React components
│   ├── RoadmapBlock.js
│   ├── PathsDisplay.js
│   ├── RoadmapGraph.js
│   └── RoadmapExplorer.js
├── lib/                # Utility functions and API client
│   ├── api.js
│   └── roadmapUtils.js
├── pages/              # Next.js pages
│   ├── index.js        # Main roadmap explorer page
│   ├── about.js        # About page with information
│   ├── _app.js         # Next.js app wrapper
│   └── api/            # API routes connecting to backend
│       ├── blocks.js
│       ├── connections.js
│       ├── paths.js
│       └── subgraph/[id].js
├── styles/             # CSS styles
├── public/             # Static assets
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies and scripts
```

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd roadmap-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Make sure your Python environment is set up:

```bash
# Install any required Python packages
pip install sqlite3
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Routes

The application uses the following API routes to communicate with the backend:

- `GET /api/blocks` - Get all blocks in the roadmap
- `GET /api/connections` - Get all connections between blocks
- `GET /api/paths?start={startId}&end={endId}&depth={depth}` - Find paths between two blocks
- `GET /api/subgraph/{blockId}` - Get subgraph information for a specific block

## Project Goals

This project aims to help individuals navigate the complex immigration process by:

1. Providing a clear visual representation of the immigration pathways
2. Helping users understand the time and cost implications of different routes
3. Allowing exploration of options based on starting point and desired outcome
4. Supporting informed decision-making through path comparison

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The project uses data from the `data.sql` file to build the roadmap
- Path finding functionality is powered by the `roadmap.py` script 