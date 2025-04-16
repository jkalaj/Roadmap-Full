import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  AlertTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ListIcon from '@mui/icons-material/List';

const PathItem = styled(ListItem)(({ theme, selected }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
}));

const PathsDisplay = ({ 
  paths, 
  onSelectPath,
  selectedPathIndex
}) => {
  const [sortCriteria, setSortCriteria] = useState('time');
  
  if (!paths || paths.length === 0) {
    return (
      <Alert severity="info">
        <AlertTitle>No Paths Found</AlertTitle>
        Select a start and end point to see possible paths
      </Alert>
    );
  }
  
  // Sort paths based on criteria
  const sortedPaths = [...paths].sort((a, b) => {
    if (sortCriteria === 'time') {
      return a.totalTime - b.totalTime;
    } else if (sortCriteria === 'cost') {
      return a.totalCost - b.totalCost;
    } else if (sortCriteria === 'steps') {
      return a.path.length - b.path.length;
    }
    return 0;
  });
  
  const handleSortChange = (event, newValue) => {
    if (newValue !== null) {
      setSortCriteria(newValue);
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Available Paths ({paths.length})</Typography>
        
        <ToggleButtonGroup
          value={sortCriteria}
          exclusive
          onChange={handleSortChange}
          size="small"
        >
          <ToggleButton value="time">
            <AccessTimeIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="cost">
            <AttachMoneyIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="steps">
            <ListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ maxHeight: 500, overflow: 'auto' }}>
        {sortedPaths.map((path, index) => (
          <PathItem 
            key={index} 
            selected={index === selectedPathIndex}
            onClick={() => onSelectPath(index)}
            button
          >
            <ListItemText
              primary={
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Path {index + 1}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    mb: 1, 
                    fontWeight: index === selectedPathIndex ? 'bold' : 'normal' 
                  }}>
                    {path.formatted}
                  </Typography>
                  
                  <StatsBox>
                    <Chip 
                      icon={<AccessTimeIcon fontSize="small" />} 
                      label={`${path.totalTime} months`}
                      size="small"
                      color={sortCriteria === 'time' ? "primary" : "default"}
                    />
                    <Chip 
                      icon={<AttachMoneyIcon fontSize="small" />} 
                      label={`$${path.totalCost}`}
                      size="small"
                      color={sortCriteria === 'cost' ? "primary" : "default"}
                    />
                    <Chip 
                      icon={<ListIcon fontSize="small" />} 
                      label={`${path.path.length} steps`}
                      size="small"
                      color={sortCriteria === 'steps' ? "primary" : "default"}
                    />
                  </StatsBox>
                </Box>
              }
            />
          </PathItem>
        ))}
      </List>
    </Paper>
  );
};

export default PathsDisplay; 