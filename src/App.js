import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Api as ApiIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import CodeScanner from './components/CodeScanner';
import OpenAPIScanner from './components/OpenAPIScanner';
import GPTScanner from './components/GPTScanner';

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
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" color="default">
        <Typography variant="h4" component="h1" sx={{ p: 2, textAlign: 'center' }}>
          Security Scanner
        </Typography>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<SecurityIcon />} label="Code Scanner" />
          <Tab icon={<ApiIcon />} label="OpenAPI Scanner" />
          <Tab icon={<PsychologyIcon />} label="GPT Scanner" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg">
        <TabPanel value={currentTab} index={0}>
          <CodeScanner />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <OpenAPIScanner />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <GPTScanner />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default App;
