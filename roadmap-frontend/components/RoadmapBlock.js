import React from 'react';
import { Paper, Typography, Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getCategoryProperties } from '../lib/roadmapUtils';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlagIcon from '@mui/icons-material/Flag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HelpIcon from '@mui/icons-material/Help';

const BlockContainer = styled(Paper)(({ theme, isActive, isCompleted, categorycolor }) => ({
  padding: theme.spacing(2),
  minWidth: '150px',
  maxWidth: '220px',
  minHeight: '100px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `2px solid ${categorycolor || theme.palette.divider}`,
  backgroundColor: isCompleted 
    ? `${theme.palette.success.light}` 
    : isActive 
      ? `${theme.palette.primary.light}` 
      : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: theme.spacing(1),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const getBlockIcon = (category) => {
  const { icon } = getCategoryProperties(category);
  
  switch (icon) {
    case 'school':
      return <SchoolIcon />;
    case 'work':
      return <WorkIcon />;
    case 'home':
      return <HomeIcon />;
    case 'business':
      return <BusinessIcon />;
    case 'flight_takeoff':
      return <FlightTakeoffIcon />;
    case 'flag':
      return <FlagIcon />;
    case 'account_balance':
      return <AccountBalanceIcon />;
    case 'attach_money':
      return <AttachMoneyIcon />;
    default:
      return <HelpIcon />;
  }
};

const RoadmapBlock = ({ 
  block, 
  active = false, 
  completed = false, 
  onClick 
}) => {
  const { color } = getCategoryProperties(block.category);
  
  const tooltipContent = (
    <Box>
      <Typography variant="subtitle1">{block.title}</Typography>
      <Typography variant="body2">Category: {block.category}</Typography>
      <Typography variant="body2">Time: {block.average_time} months</Typography>
      <Typography variant="body2">Cost: ${block.cost}</Typography>
      {block.prerequisites.length > 0 && (
        <Typography variant="body2">
          Prerequisites: {block.prerequisites.length}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <BlockContainer 
        isActive={active} 
        isCompleted={completed}
        categorycolor={color}
        onClick={() => onClick && onClick(block)}
        elevation={active ? 3 : 1}
      >
        <Box sx={{ mb: 1, color }}>
          {getBlockIcon(block.category)}
        </Box>
        
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {block.title}
        </Typography>
        
        <MetricBox>
          <Box>
            <Typography variant="caption" display="block">
              Time
            </Typography>
            <Typography variant="body2">
              {block.average_time}m
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" display="block">
              Cost
            </Typography>
            <Typography variant="body2">
              ${block.cost}
            </Typography>
          </Box>
        </MetricBox>
      </BlockContainer>
    </Tooltip>
  );
};

export default RoadmapBlock; 