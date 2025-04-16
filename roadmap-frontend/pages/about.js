import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  AppBar, 
  Toolbar,
  Button,
  Link,
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoIcon from '@mui/icons-material/Info';

export default function About() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Immigration Roadmap
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Explorer
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <InfoIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              About
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" gutterBottom>
            About the Immigration Roadmap
          </Typography>
          
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="body1" paragraph>
              The Immigration Roadmap Explorer is a tool designed to help individuals navigate the complex process
              of immigration. By visualizing different paths and options, it provides a clearer understanding of the steps,
              requirements, costs, and timelines involved in moving from entry to citizenship.
            </Typography>
            <Typography variant="body1" paragraph>
              This tool allows users to explore various immigration paths based on their starting point and desired destination.
              It provides information on the estimated time, costs, and requirements for each step along the way.
            </Typography>
          </Paper>
          
          <Typography variant="h5" gutterBottom>
            How to Use the Roadmap
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    1. Select Starting Point
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Choose your current status or entry point from the dropdown menu.
                    This could be "Prospective Immigrant," "Visitor," or any other relevant starting point.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    2. Choose Destination
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Select your desired end goal, such as "Permanent Residency," "Citizenship," or any other
                    status you wish to achieve.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    3. Explore Paths
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    The tool will display all possible paths between your starting point and destination,
                    along with details about time, cost, and number of steps for each option.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom>
            Data Sources and Disclaimer
          </Typography>
          
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              The information provided in this roadmap is based on general immigration processes and requirements.
              It is meant to serve as a guide and visualization tool rather than legal advice.
            </Typography>
            <Typography variant="body1" paragraph>
              The estimated times and costs are approximations and may vary based on individual circumstances,
              changes in immigration policies, and other factors. Always consult with immigration professionals
              for advice specific to your situation.
            </Typography>
            <Typography variant="body1">
              Data is regularly updated to reflect current immigration processes, but users should verify
              information with official government sources before making decisions.
            </Typography>
          </Paper>
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