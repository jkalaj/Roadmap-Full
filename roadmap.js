// ** React Imports
import React, { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Paper from '@mui/material/Paper'
import { styled, alpha } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

// ** Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import HomeIcon from '@mui/icons-material/Home'
import BusinessIcon from '@mui/icons-material/Business'
import PublicIcon from '@mui/icons-material/Public'
import FlagIcon from '@mui/icons-material/Flag'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import ElderlyIcon from '@mui/icons-material/Elderly'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// ** Layout Import
import ImmigrantLayout from 'src/layouts/ImmigrantLayout'

// ** Import local roadmap data
import journeyData from 'src/data/immigrationJourney.json'

// Styled components for the org chart
const NodeBox = styled(Paper)(({ theme, active }) => ({
  padding: theme.spacing(2),
  minWidth: '200px',
  maxWidth: '250px',
  margin: '0 auto',
  textAlign: 'center',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : theme.palette.background.paper,
  border: active ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: theme.shadows[3],
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  }
}))

const LevelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative'
}))

const ChildrenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2)
}))

const ConnectionLine = styled(Box)(() => ({
  width: '2px',
  height: '20px',
  backgroundColor: '#ccc',
  margin: '0 auto'
}))

const BranchLine = styled(Box)(() => ({
  height: '20px',
  width: '100%',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '2px',
    height: '100%',
    backgroundColor: '#ccc'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: '2px',
    backgroundColor: '#ccc'
  }
}))

const getNodeIcon = (nodeType) => {
  switch (nodeType) {
    case 'Visitor':
      return <FlightTakeoffIcon color="primary" />
    case 'Prospective Immigrant':
      return <PersonIcon color="primary" />
    case 'Study':
      return <SchoolIcon color="primary" />
    case 'Work Permit Open':
    case 'Work Permit Closed':
    case 'Equitable Employment':
    case 'Under Employed':
    case 'Unemployed':
      return <WorkIcon color="primary" />
    case 'Rental':
    case 'Homeownership':
      return <HomeIcon color="primary" />
    case 'Startup Visa':
    case 'Foreign Investor':
    case 'Retail Investment':
      return <BusinessIcon color="primary" />
    case 'Digital Nomad Visa':
    case 'E-travel Visa':
      return <PublicIcon color="primary" />
    case 'Temporary Resident':
      return <FlagIcon color="primary" />
    case 'Permanent Residency':
      return <FlagIcon color="success" />
    case 'Citizenship':
      return <FlagIcon color="success" />
    case 'Marriage Certificate':
      return <FavoriteIcon color="error" />
    case 'LMIA':
      return <SupervisorAccountIcon color="primary" />
    case 'Asylum/Refugee':
      return <VolunteerActivismIcon color="warning" />
    case 'Retiree (65+)':
      return <ElderlyIcon color="primary" />
    case 'Express Entry':
    case 'Nomination Provincial':
    case 'Nomination Atlantic':
    case 'Nomination Rural Community':
      return <AccountBalanceIcon color="primary" />
    default:
      return <PersonIcon color="primary" />
  }
}

const getDescription = (nodeName) => {
  switch (nodeName) {
    case 'Visitor':
      return 'Initial entry to the country for tourism or short-term purposes'
    case 'Digital Nomad Visa':
      return 'Special visa for remote workers and digital professionals'
    case 'E-travel Visa':
      return 'Electronic visa for short-term visitors'
    case 'Prospective Immigrant':
      return 'Individuals intending to start an immigration process'
    case 'Study':
      return 'Educational pathway for immigration'
    case 'Work Permit Open':
      return 'Permission to work for any employer without restrictions'
    case 'Work Permit Closed':
      return 'Permission to work for a specific employer only'
    case 'Spouse/Family':
      return 'Immigration path through family relationships'
    case 'Startup Visa':
      return 'Special program for entrepreneurs starting a business'
    case 'LMIA':
      return 'Labour Market Impact Assessment - confirms no Canadians can fill the job'
    case 'Foreign Investor':
      return 'Program for individuals investing significant capital'
    case 'Equitable Employment':
      return 'Fair employment that matches qualifications and skills'
    case 'Under Employed':
      return 'Working in positions below qualifications or part-time involuntarily'
    case 'Unemployed':
      return 'Currently without employment but seeking work'
    case 'Rental':
      return 'Temporary housing solution through renting property'
    case 'Homeownership':
      return 'Purchasing and owning residential property'
    case 'Marriage Certificate':
      return 'Official documentation of marriage, which can affect immigration status'
    case 'Asylum/Refugee':
      return 'Protection for those fleeing persecution in their home countries'
    case 'Temporary Resident':
      return 'Legal status allowing temporary stay in the country'
    case 'Express Entry':
      return 'System for managing applications for skilled workers'
    case 'Nomination Provincial':
      return 'Provincial nomination programs for immigration'
    case 'Nomination Atlantic':
      return 'Special immigration programs for Atlantic provinces'
    case 'Nomination Rural Community':
      return 'Programs targeting immigration to rural areas'
    case 'Permanent Residency':
      return 'Long-term right to live and work without time limitations'
    case 'Citizenship':
      return 'Full membership as a citizen with all rights and responsibilities'
    case 'Retail Investment':
      return 'Investment in retail businesses or commercial properties'
    case 'Retiree (65+)':
      return 'Special provisions for retired individuals'
    default:
      return 'Information about this immigration stage'
  }
}

// Main immigration stages/hierarchy defined in a simple structure
const immigrationHierarchy = {
  name: 'Consumer Journey',
  children: [
    {
      name: 'Visitor',
      children: [
        {
          name: 'Digital Nomad Visa',
          children: []
        },
        {
          name: 'E-travel Visa',
          children: []
        }
      ]
    },
    {
      name: 'Prospective Immigrant',
      children: [
        {
          name: 'Study',
          children: [
            { name: 'Work Permit Open', children: [] },
            { name: 'Spouse/Family', children: [] }
          ]
        },
        {
          name: 'Startup Visa',
          children: [
            { name: 'LMIA', children: [] }
          ]
        },
        { name: 'Foreign Investor', children: [] },
        { name: 'Work Permit Open', children: [] },
        { name: 'Work Permit Closed', children: [] },
        {
          name: 'Equitable Employment',
          children: [
            { name: 'Under Employed', children: [] },
            { name: 'Unemployed', children: [] }
          ]
        },
        {
          name: 'Rental',
          children: [
            { name: 'Homeownership', children: [] }
          ]
        }
      ]
    },
    {
      name: 'Marriage Certificate',
      children: []
    },
    {
      name: 'Asylum/Refugee',
      children: []
    },
    {
      name: 'Temporary Resident',
      children: [
        { name: 'Express Entry', children: [] },
        { name: 'Nomination Provincial', children: [] },
        { name: 'Nomination Atlantic', children: [] },
        { name: 'Nomination Rural Community', children: [] }
      ]
    },
    {
      name: 'Permanent Residency',
      children: [
        { name: 'Study', children: [] },
        { name: 'Under Employed', children: [] },
        { name: 'Unemployed', children: [] },
        { name: 'Equitable Employment', children: [] },
        { name: 'Homeownership', children: [] }
      ]
    },
    {
      name: 'Citizenship',
      children: [
        { name: 'Homeownership', children: [] },
        { name: 'Retail Investment', children: [] }
      ]
    },
    {
      name: 'Retiree (65+)',
      children: []
    }
  ]
}

// Function to convert the JSON structure to our hierarchical structure
const parseJourneyData = (data) => {
  if (!data || !data.ConsumerJourney) return immigrationHierarchy;
  
  const journey = data.ConsumerJourney;
  const result = {
    name: 'Consumer Journey',
    children: []
  };
  
  // Process each top-level node
  Object.keys(journey).forEach(key => {
    const node = {
      name: key,
      children: []
    };
    
    const nodeData = journey[key];
    
    // Process options
    if (nodeData.options) {
      if (Array.isArray(nodeData.options)) {
        nodeData.options.forEach(option => {
          if (typeof option === 'string') {
            node.children.push({
              name: option,
              children: []
            });
          } else {
            // Handle object options
            const optionName = Object.keys(option)[0];
            node.children.push({
              name: optionName,
              children: []
            });
          }
        });
      }
    }
    
    // Process paths
    if (nodeData.paths) {
      if (Array.isArray(nodeData.paths)) {
        nodeData.paths.forEach(path => {
          node.children.push({
            name: path,
            children: []
          });
        });
      } else {
        // Handle object paths
        Object.keys(nodeData.paths).forEach(pathName => {
          const pathData = nodeData.paths[pathName];
          const pathNode = {
            name: pathName,
            children: []
          };
          
          // Add path children if they exist
          if (pathData.requires) {
            const requires = Array.isArray(pathData.requires) ? pathData.requires : [pathData.requires];
            requires.forEach(req => {
              pathNode.children.push({
                name: req,
                children: []
              });
            });
          }
          
          if (pathData.leadsTo) {
            const leadsTo = Array.isArray(pathData.leadsTo) ? pathData.leadsTo : [pathData.leadsTo];
            leadsTo.forEach(lead => {
              pathNode.children.push({
                name: lead,
                children: []
              });
            });
          }
          
          node.children.push(pathNode);
        });
      }
    }
    
    result.children.push(node);
  });
  
  return result;
}

// Component to render a single node in the hierarchy
const HierarchyNode = ({ node, level = 0, onClick, selectedNode }) => {
  const isActive = selectedNode === node.name;
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Tooltip title={getDescription(node.name)} arrow>
        <NodeBox active={isActive} onClick={() => onClick(node)}>
          <Box sx={{ mb: 1 }}>
            {getNodeIcon(node.name)}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {node.name}
          </Typography>
        </NodeBox>
      </Tooltip>
      
      {node.children && node.children.length > 0 && (
        <>
          <ConnectionLine />
          {level < 1 && (
            <BranchLine />
          )}
          <ChildrenContainer>
            {node.children.map((child, index) => (
              <Box key={index} sx={{ mx: 1, flexBasis: `${100/node.children.length}%`, maxWidth: '200px' }}>
                <HierarchyNode 
                  node={child} 
                  level={level + 1} 
                  onClick={onClick}
                  selectedNode={selectedNode}
                />
              </Box>
            ))}
          </ChildrenContainer>
        </>
      )}
    </Box>
  );
};

// Main roadmap component
const Roadmap = () => {
  const [hierarchyData] = useState(parseJourneyData(journeyData));
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Main immigration Journey stages
  const mainStages = [
    'Visitor',
    'Prospective Immigrant', 
    'Temporary Resident',
    'Permanent Residency',
    'Citizenship'
  ];
  
  const handleNodeClick = (node) => {
    setSelectedNode(node.name);
  };
  
  // Render the main top-level stages as a horizontal flow
  const renderMainStages = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
      {mainStages.map((stage, index) => (
        <Box key={stage} sx={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Tooltip title={getDescription(stage)} arrow>
            <NodeBox 
              active={selectedNode === stage}
              onClick={() => setSelectedNode(stage)}
              sx={{ minWidth: '150px' }}
            >
              <Box sx={{ mb: 1 }}>
                {getNodeIcon(stage)}
              </Box>
              <Typography variant="subtitle1">{stage}</Typography>
            </NodeBox>
          </Tooltip>
          
          {index < mainStages.length - 1 && (
            <ArrowDownwardIcon
              sx={{ 
                transform: 'rotate(-90deg)',
                mx: 1,
                color: 'text.disabled',
                display: { xs: 'none', md: 'block' }
              }} 
            />
          )}
        </Box>
      ))}
    </Box>
  );
  
  // Find the data for the selected stage
  const findSelectedStageData = () => {
    if (!selectedNode) return null;
    
    return hierarchyData.children.find(child => child.name === selectedNode);
  };
  
  // Render the selected stage and its pathways
  const renderSelectedStage = () => {
    const stageData = findSelectedStageData();
    
    if (!stageData) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {stageData.name} Pathways
        </Typography>
        
        <LevelContainer>
          <HierarchyNode 
            node={stageData} 
            onClick={handleNodeClick}
            selectedNode={selectedNode}
          />
        </LevelContainer>
      </Box>
    );
  };
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          Immigration Roadmap
        </Typography>
        <Typography variant='body2'>
          Your immigration journey from visitor to citizenship
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 6 }}>
          <AlertTitle>About Your Immigration Roadmap</AlertTitle>
          Explore the pathways available for immigration, from temporary visits to citizenship.
          Click on any stage to see more details about the available options.
        </Alert>

        <Card>
          <CardHeader title="Immigration Journey Map" />
          <CardContent>
            {/* Main immigration stages horizontal flow */}
            {renderMainStages()}
            
            {/* Selected stage details as hierarchy */}
            {renderSelectedStage()}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

Roadmap.getLayout = page => <ImmigrantLayout>{page}</ImmigrantLayout>

export default Roadmap 