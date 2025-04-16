import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Divider 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlagIcon from '@mui/icons-material/Flag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HelpIcon from '@mui/icons-material/Help';

import { getCategoryProperties } from '../lib/roadmapUtils';
import RoadmapBlock from './RoadmapBlock';

// Styled custom TreeItem for our roadmap
const StyledTreeItem = styled(TreeItem)(({ theme, isHighlighted, categoryColor }) => ({
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderLeft: isHighlighted ? `4px solid ${categoryColor || theme.palette.primary.main}` : 'none',
    backgroundColor: isHighlighted ? alpha(categoryColor || theme.palette.primary.main, 0.1) : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .MuiTreeItem-group': {
    marginLeft: theme.spacing(3),
    borderLeft: `1px dashed ${theme.palette.divider}`,
    paddingLeft: theme.spacing(1),
  },
}));

// Helper to get correct icon based on category
const getNodeIcon = (category) => {
  const { icon } = getCategoryProperties(category);
  
  switch (icon) {
    case 'school':
      return <SchoolIcon fontSize="small" />;
    case 'work':
      return <WorkIcon fontSize="small" />;
    case 'home':
      return <HomeIcon fontSize="small" />;
    case 'business':
      return <BusinessIcon fontSize="small" />;
    case 'flight_takeoff':
      return <FlightTakeoffIcon fontSize="small" />;
    case 'flag':
      return <FlagIcon fontSize="small" />;
    case 'account_balance':
      return <AccountBalanceIcon fontSize="small" />;
    case 'attach_money':
      return <AttachMoneyIcon fontSize="small" />;
    default:
      return <HelpIcon fontSize="small" />;
  }
};

// Custom label component for tree items
const ItemLabel = ({ title, category, time, cost, isHighlighted }) => {
  const { color } = getCategoryProperties(category || 'Status');
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
      <Box sx={{ mr: 1, color }}>
        {getNodeIcon(category)}
      </Box>
      <Typography variant="body2" sx={{ 
        fontWeight: isHighlighted ? 'bold' : 'normal',
        color: isHighlighted ? color : 'inherit'
      }}>
        {title}
      </Typography>
      {(time > 0 || cost > 0) && (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
          {time > 0 && <Box component="span" sx={{ mr: 1 }}>{time}m</Box>}
          {cost > 0 && <Box component="span">${cost}</Box>}
        </Box>
      )}
    </Box>
  );
};

const RoadmapTreeView = ({ 
  graph, 
  selectedPath = [], 
  onNodeClick,
  startBlock,
  detailed = false
}) => {
  // Recursively build tree nodes as JSX
  const renderTree = (nodeId, processedNodes = new Set(), level = 0) => {
    if (!nodeId || processedNodes.has(nodeId) || level > 10 || !graph[nodeId]) {
      return null;
    }
    
    const node = graph[nodeId];
    const newProcessed = new Set(processedNodes);
    newProcessed.add(nodeId);
    
    const isHighlighted = selectedPath.includes(nodeId);
    const { color } = getCategoryProperties(node.category || 'Status');
    
    // Filter forward connections to avoid cycles
    const validChildren = node.forward_connections
      .filter(childId => childId && !processedNodes.has(childId) && graph[childId]);
    
    return (
      <StyledTreeItem 
        key={nodeId} 
        nodeId={String(nodeId)}
        isHighlighted={isHighlighted}
        categoryColor={color}
        label={
          <ItemLabel 
            title={node.title || `Node ${nodeId}`}
            category={node.category}
            time={node.average_time}
            cost={node.cost}
            isHighlighted={isHighlighted}
          />
        }
        onClick={() => onNodeClick && onNodeClick(nodeId)}
      >
        {validChildren.map(childId => renderTree(childId, newProcessed, level + 1))}
      </StyledTreeItem>
    );
  };
  
  // Render a detailed card view
  const detailedView = () => {
    return (
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
              onClick={() => onNodeClick && onNodeClick(block.id)}
            />
          </Box>
        ))}
      </Box>
    );
  };
  
  // If no starting block is available or graph is empty
  if (!startBlock || !graph[startBlock] || Object.keys(graph).length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Immigration Roadmap
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>
          Please select a starting point to visualize the roadmap.
        </Typography>
      </Paper>
    );
  }
  
  // Filter out any invalid IDs from the expanded list
  const validExpandedIds = [startBlock, ...selectedPath]
    .filter(id => id && graph[id])
    .map(String);
  
  // Render either detailed view or tree view
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Immigration Pathways
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {detailed ? (
        detailedView()
      ) : (
        <SimpleTreeView
          aria-label="Immigration Pathways"
          expandIcon={<ChevronRightIcon />}
          collapseIcon={<ExpandMoreIcon />}
          defaultExpanded={validExpandedIds}
          sx={{ height: 'auto', flexGrow: 1, overflow: 'auto' }}
          onNodeSelect={(event, ids) => {
            if (ids.length > 0) {
              onNodeClick && onNodeClick(ids[0]);
            }
          }}
        >
          {renderTree(startBlock)}
        </SimpleTreeView>
      )}
    </Paper>
  );
};

export default RoadmapTreeView; 