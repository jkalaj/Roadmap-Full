import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardHeader, 
  CardContent,
  TextField,
  Autocomplete,
  Alert,
  AlertTitle,
  Paper,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';

// Components
import RoadmapBlock from './RoadmapBlock';
import PathsDisplay from './PathsDisplay';
import CustomTreeView from './CustomTreeView';

// Utilities
import { createGraph, calculatePathMetrics, formatPath, findTerminalBlocks } from '../lib/roadmapUtils';
import { roadmapApi } from '../lib/api';

const RoadmapExplorer = () => {
  // State hooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [graph, setGraph] = useState({});
  
  const [startBlock, setStartBlock] = useState(null);
  const [endBlock, setEndBlock] = useState(null);
  const [pathDistance, setPathDistance] = useState(5);
  
  const [paths, setPaths] = useState([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState(-1);
  const [selectedPath, setSelectedPath] = useState([]);
  
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch blocks and connections
        const blocksData = await roadmapApi.getAllBlocks();
        const connectionsData = await roadmapApi.getConnections();
        
        setBlocks(blocksData);
        setConnections(connectionsData);
        
        // Create the graph
        const graphData = createGraph(blocksData, connectionsData);
        setGraph(graphData);
        
        // Set default start and end blocks if available
        const { startingBlocks, endingBlocks } = findTerminalBlocks(graphData);
        if (startingBlocks.length > 0) {
          setStartBlock(startingBlocks[0].id);
        }
        if (endingBlocks.length > 0) {
          setEndBlock(endingBlocks[0].id);
        }
        
      } catch (err) {
        console.error('Error loading roadmap data:', err);
        setError('Failed to load roadmap data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Find paths when start/end blocks or depth change
  useEffect(() => {
    const findPaths = async () => {
      if (!startBlock || !endBlock || !graph[startBlock] || !graph[endBlock]) {
        setPaths([]);
        return;
      }
      
      try {
        // Fetch paths from API
        const pathsData = await roadmapApi.getPaths(startBlock, endBlock, pathDistance);
        
        // Process paths with metrics
        const processedPaths = pathsData.map(path => {
          const { totalTime, totalCost } = calculatePathMetrics(graph, path);
          return {
            path,
            totalTime,
            totalCost,
            formatted: formatPath(graph, path)
          };
        });
        
        setPaths(processedPaths);
        
        // Select first path by default if available
        if (processedPaths.length > 0) {
          setSelectedPathIndex(0);
          setSelectedPath(processedPaths[0].path);
        } else {
          setSelectedPathIndex(-1);
          setSelectedPath([]);
        }
        
      } catch (err) {
        console.error('Error finding paths:', err);
        setPaths([]);
      }
    };
    
    findPaths();
  }, [startBlock, endBlock, pathDistance, graph]);
  
  // When a path is selected
  const handleSelectPath = (index) => {
    if (index >= 0 && index < paths.length) {
      setSelectedPathIndex(index);
      setSelectedPath(paths[index].path);
    }
  };
  
  // When a node is clicked in the tree or list
  const handleNodeClick = (nodeId) => {
    if (!startBlock) {
      setStartBlock(nodeId);
    } else if (!endBlock || startBlock === endBlock) {
      setEndBlock(nodeId);
    } else {
      // If both start and end are set, set the clicked as start
      setStartBlock(nodeId);
      setEndBlock(null);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Immigration Roadmap Explorer
        </Typography>
        <Typography variant="body1" paragraph>
          Explore different paths from entry to citizenship. Select starting and ending points to see possible routes.
        </Typography>
      </Grid>
      
      {/* Settings Card */}
      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={Object.keys(graph).sort()}
                getOptionLabel={(option) => graph[option]?.title || option}
                value={startBlock}
                onChange={(_, newValue) => setStartBlock(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Starting Point" 
                    variant="outlined" 
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={Object.keys(graph).sort()}
                getOptionLabel={(option) => graph[option]?.title || option}
                value={endBlock}
                onChange={(_, newValue) => setEndBlock(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Destination" 
                    variant="outlined" 
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Path Distance</InputLabel>
                <Select
                  value={pathDistance}
                  label="Path Distance"
                  onChange={(e) => setPathDistance(e.target.value)}
                >
                  <MenuItem value={1}>1 (Direct)</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={-1}>Unlimited</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  label="View Mode"
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <MenuItem value="tree">Tree View</MenuItem>
                  <MenuItem value="list">List View</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Path Results */}
      <Grid item xs={12} md={4}>
        <PathsDisplay 
          paths={paths} 
          onSelectPath={handleSelectPath}
          selectedPathIndex={selectedPathIndex}
        />
      </Grid>
      
      {/* Tree/List Visualization */}
      <Grid item xs={12} md={8}>
        {viewMode === 'tree' ? (
          <CustomTreeView 
            graph={graph}
            selectedPath={selectedPath}
            onNodeClick={handleNodeClick}
            startBlock={startBlock}
          />
        ) : (
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Roadmap Blocks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              maxHeight: 600,
              overflow: 'auto'
            }}>
              {Object.values(graph).map((block) => (
                <Box key={block.id} sx={{ width: 200, m: 1 }}>
                  <RoadmapBlock 
                    block={block}
                    active={selectedPath.includes(block.id)}
                    onClick={() => handleNodeClick(block.id)}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Grid>
      
      {/* Selected Path Details */}
      {selectedPathIndex >= 0 && (
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Selected Path Details" 
              subheader={`${graph[startBlock]?.title || startBlock} → ${graph[endBlock]?.title || endBlock}`}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {paths[selectedPathIndex]?.formatted}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip 
                  label={`Total Time: ${paths[selectedPathIndex]?.totalTime} months`}
                  color="primary"
                />
                <Chip 
                  label={`Total Cost: $${paths[selectedPathIndex]?.totalCost}`}
                  color="primary"
                />
                <Chip 
                  label={`Steps: ${paths[selectedPathIndex]?.path.length}`}
                  color="primary"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default RoadmapExplorer; 