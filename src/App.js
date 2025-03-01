import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Api as ApiIcon,
  Psychology as PsychologyIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import CodeScanner from './components/CodeScanner';
import OpenAPIScanner from './components/OpenAPIScanner';
import GPTScanner from './components/GPTScanner';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2962ff', // Bright blue
      light: '#768fff',
      dark: '#0039cb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c4dff', // Purple
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    error: {
      main: '#ff3d00',
    },
    warning: {
      main: '#ffa000',
    },
    success: {
      main: '#00c853',
    },
    info: {
      main: '#00b0ff',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #2962ff 0%, #7c4dff 100%)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          minHeight: 64,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scanner-tabpanel-${index}`}
      aria-labelledby={`scanner-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            pt: 2,
            pb: 1
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 2
          }}>
            <ShieldIcon sx={{ fontSize: 40 }} />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Security Scanner Pro
            </Typography>
          </Box>
          <Container maxWidth="lg">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab 
                icon={<SecurityIcon />} 
                label="Code Scanner" 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                    mb: 0,
                  }
                }}
              />
              <Tab 
                icon={<ApiIcon />} 
                label="OpenAPI Scanner"
                sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                    mb: 0,
                  }
                }}
              />
              <Tab 
                icon={<PsychologyIcon />} 
                label="GPT Scanner"
                sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                    mb: 0,
                  }
                }}
              />
            </Tabs>
          </Container>
        </AppBar>

        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: 4,
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              left: 20,
              right: 20,
              bottom: -20,
              background: 'linear-gradient(180deg, rgba(41,98,255,0.05) 0%, rgba(124,77,255,0.05) 100%)',
              borderRadius: 4,
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <TabPanel value={currentTab} index={0}>
              <CodeScanner />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <OpenAPIScanner />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <GPTScanner />
            </TabPanel>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
