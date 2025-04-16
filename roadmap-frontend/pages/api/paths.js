// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateMockPaths } from '../../lib/mockData';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { start, end, depth = 5 } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end parameters are required' });
    }
    
    // Convert depth to integer
    const depthInt = parseInt(depth, 10);
    
    // Create the full path to the Python script
    const pythonScriptPath = path.resolve(process.cwd(), '../../roadmap.py');
    
    // Check if the Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.log('Python script not found, using mock data');
      return res.status(200).json(generateMockPaths(start, end, depthInt));
    }
    
    // Call Python script to find paths
    const pythonProcess = spawn('python', [
      pythonScriptPath,
      'get_paths',  // Command to run in the Python script
      start,
      end,
      depthInt.toString()
    ]);
    
    let dataString = '';
    let errorString = '';
    
    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Collect errors from stderr
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    // Process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}: ${errorString}`);
        console.log('Falling back to mock data');
        return res.status(200).json(generateMockPaths(start, end, depthInt));
      }
      
      try {
        // Parse the paths from the output
        // Format is expected to be a list of paths, where each path is a list of block IDs
        const outputLines = dataString.split('\n');
        const paths = [];
        
        let currentPath = null;
        
        for (const line of outputLines) {
          if (line.startsWith('Found ')) {
            // This is the summary line, ignore
            continue;
          } else if (line.includes(' -> ')) {
            // This is a path line
            currentPath = line.split(' -> ').map(id => id.trim());
            paths.push(currentPath);
          } else if (line.trim().startsWith('Time:') && currentPath) {
            // This is a metrics line, but we'll calculate metrics on the frontend
            continue;
          }
        }
        
        res.status(200).json(paths);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        console.log('Falling back to mock data');
        res.status(200).json(generateMockPaths(start, end, depthInt));
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    console.log('Falling back to mock data');
    
    // Get query parameters
    const { start, end, depth = 5 } = req.query;
    const depthInt = parseInt(depth, 10);
    
    // Return mock paths as fallback
    res.status(200).json(generateMockPaths(start, end, depthInt));
  }
} 