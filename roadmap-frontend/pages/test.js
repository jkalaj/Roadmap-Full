import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar,
  Button,
  Link
} from '@mui/material';
import CustomTreeView from '../components/CustomTreeView';
import { mockBlocks, mockConnections, generateMockPaths } from '../lib/mockData';
import { createGraph } from '../lib/roadmapUtils';

export default function TestPage() {
  const [graph, setGraph] = useState({});
  const [startBlock, setStartBlock] = useState('prospective');
  const [selectedPath, setSelectedPath] = useState([]);
  
  // Initialize with mock data
  useEffect(() => {
    // Create the graph from mock data
    const graphData = createGraph(mockBlocks, mockConnections);
    setGraph(graphData);
    
    // Generate a sample path
    const samplePath = generateMockPaths('prospective', 'citizenship')[0] || [];
    setSelectedPath(samplePath);
  }, []);
  
  // Handle node click
  const handleNodeClick = (nodeId) => {
    console.log('Node clicked:', nodeId);
  };
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Immigration Roadmap - Custom Tree View
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Main Page
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Custom Tree View (Mock Data)
          </Typography>
          <Typography variant="body1" paragraph>
            This page uses a custom tree implementation without the MUI X TreeView component.
          </Typography>
          
          <Box sx={{ height: '600px' }}>
            <CustomTreeView 
              graph={graph}
              selectedPath={selectedPath}
              onNodeClick={handleNodeClick}
              startBlock={startBlock}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
} 