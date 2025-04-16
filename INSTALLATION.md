# Roadmap Project - Installation Guide

This guide provides step-by-step instructions for setting up the Roadmap project on a new machine.

## Prerequisites

- Git
- Node.js (v14 or higher)
- npm (v6 or higher)
- Python (for backend, if applicable)

## Step 1: Clone the Repository

```bash
git clone https://github.com/jkalaj/Roadmap-Full.git
cd Roadmap-Full
```

## Step 2: Frontend Setup

Navigate to the frontend directory and install all dependencies:

```bash
cd roadmap-frontend

# Install core dependencies
npm install @emotion/react@11.11.0 @emotion/styled@11.11.0 @mui/icons-material@5.15.4 @mui/lab@5.0.0-alpha.155 @mui/material@5.15.4 @mui/x-tree-view@7.28.1 axios@1.6.2 d3@7.8.5 next@14.1.0 react@18.2.0 react-dom@18.2.0 sqlite@5.1.1 sqlite3@5.1.6

# Install dev dependencies
npm install --save-dev @types/node@20.4.4 @types/react@18.2.20 eslint@8.47.0 eslint-config-next@14.0.1 typescript@5.1.6
```

### SQLite Setup

If you encounter issues with SQLite3 (which has native dependencies), try rebuilding it:

```bash
npm rebuild sqlite3
```

## Step 3: Run the Frontend Application

Start the development server:

```bash
npm run dev
```

The application should now be running at http://localhost:3000

## Step 4: Backend Setup (If Applicable)

If the project includes a Python backend:

```bash
# Return to project root
cd ..

# Create and activate a virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

# Install dependencies (if requirements.txt exists)
pip install -r requirements.txt
```

## Step 5: Run the Backend (If Applicable)

The command to start the backend will depend on the specific implementation. It might be something like:

```bash
python roadmap.py
```

## Troubleshooting

### Node Module Issues

If you encounter problems with missing modules or incompatible versions:

1. Delete the `node_modules` folder and `package-lock.json`
2. Run `npm install` again with the explicit versions

### SQLite Issues

SQLite may require additional system dependencies:

- **Ubuntu/Debian**: `sudo apt-get install -y python3-dev libsqlite3-dev`
- **macOS**: `brew install sqlite3`
- **Windows**: Consider using Windows Subsystem for Linux (WSL) for better compatibility

### Next.js Build Issues

If you encounter issues with Next.js:

```bash
# Clear Next.js cache
rm -rf .next
# Rebuild
npm run build
``` 