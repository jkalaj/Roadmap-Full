import React from 'react';
import { 
  Container, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography,
  Button,
  Link
} from '@mui/material';
import RoadmapExplorer from '../components/RoadmapExplorer';

export default function Home() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Immigration Roadmap
          </Typography>
          <Button color="inherit" component={Link} href="/test" sx={{ mr: 2 }}>
            Test View
          </Button>
          <Button color="inherit" component={Link} href="/about">
            About
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <RoadmapExplorer />
        </Box>
      </Container>
      
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            Immigration Roadmap Explorer - Helping navigate your immigration journey
          </Typography>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </>
  );
} 