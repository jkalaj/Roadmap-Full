import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

// Styled components for tree nodes
const NodeContainer = styled(ListItem)(({ theme, highlighted, categorycolor }) => ({
  borderLeft: highlighted ? `4px solid ${categorycolor || theme.palette.primary.main}` : 'none',
  backgroundColor: highlighted ? `${categorycolor}10` : 'transparent',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
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

// TreeNode component that renders a single node and its children
const TreeNode = ({ 
  nodeId, 
  node, 
  graph, 
  level = 0, 
  selectedPath = [], 
  onNodeClick,
  expandedNodes,
  toggleNode
}) => {
  if (!node) return null;

  const isHighlighted = selectedPath.includes(nodeId);
  const { color } = getCategoryProperties(node.category || 'Status');
  const isExpanded = expandedNodes.includes(nodeId);
  
  // Get valid children (avoid cycles)
  const validChildren = node.forward_connections.filter(
    childId => childId && graph[childId]
  );
  
  const hasChildren = validChildren.length > 0;
  
  return (
    <React.Fragment>
      <NodeContainer 
        button
        highlighted={isHighlighted} 
        categorycolor={color}
        onClick={() => onNodeClick && onNodeClick(nodeId)}
        sx={{ pl: level * 2 + 2 }}
      >
        {hasChildren && (
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(nodeId);
            }}
            sx={{ mr: 1 }}
          >
            {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 28, mr: 1 }} />}
        
        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color }}>
          {getNodeIcon(node.category)}
        </ListItemIcon>
        
        <ListItemText 
          primary={
            <Typography variant="body2" sx={{ 
              fontWeight: isHighlighted ? 'bold' : 'normal',
              color: isHighlighted ? color : 'inherit'
            }}>
              {node.title}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', fontSize: '0.75rem' }}>
              {node.average_time > 0 && (
                <Typography variant="caption" sx={{ mr: 1 }}>
                  {node.average_time}m
                </Typography>
              )}
              {node.cost > 0 && (
                <Typography variant="caption">
                  ${node.cost}
                </Typography>
              )}
            </Box>
          }
        />
      </NodeContainer>
      
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {validChildren.map(childId => (
              <TreeNode
                key={childId}
                nodeId={childId}
                node={graph[childId]}
                graph={graph}
                level={level + 1}
                selectedPath={selectedPath}
                onNodeClick={onNodeClick}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

// The main CustomTreeView component
const CustomTreeView = ({ 
  graph, 
  selectedPath = [], 
  onNodeClick,
  startBlock,
  detailed = false
}) => {
  // Track expanded nodes
  const [expandedNodes, setExpandedNodes] = useState([startBlock, ...selectedPath]);
  
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
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
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Immigration Pathways
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {detailed ? (
        detailedView()
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <TreeNode
            nodeId={startBlock}
            node={graph[startBlock]}
            graph={graph}
            selectedPath={selectedPath}
            onNodeClick={onNodeClick}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
          />
        </List>
      )}
    </Paper>
  );
};

export default CustomTreeView; 