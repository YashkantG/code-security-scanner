import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { analyzeCode } from './services/securityAnalyzer';

function App() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');

  const analyzeSecurity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeCode(code, language);
      setResults(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Update filename and try to detect language
    setFileName(file.name);
    const extension = file.name.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'php': 'php'
    };
    if (languageMap[extension]) {
      setLanguage(languageMap[extension]);
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'info.main';
      default:
        return 'info.main';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 2 }} />
          Code Security Scanner
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="csharp">C#</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ minWidth: '200px' }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  accept=".js,.py,.java,.cs,.php"
                  onChange={handleFileUpload}
                />
              </Button>
              {fileName && (
                <Typography variant="body2" color="text.secondary">
                  Selected file: {fileName}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              multiline
              rows={10}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here or upload a file..."
              variant="outlined"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={analyzeSecurity}
              disabled={loading || !code.trim()}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze Code'}
            </Button>
          </Stack>
        </Paper>

        {results && (
          <Box sx={{ mt: 4 }}>
            <Alert 
              severity={results.overallRisk.toLowerCase()} 
              sx={{ mb: 3 }}
            >
              Overall Risk Level: {results.overallRisk}
            </Alert>

            <Typography variant="h6" gutterBottom>
              Security Analysis Results
            </Typography>
            
            <List>
              {results.vulnerabilities.map((vuln, index) => (
                <ListItem key={index} sx={{ 
                  bgcolor: `${getSeverityColor(vuln.severity)}15`,
                  borderRadius: 1,
                  mb: 1 
                }}>
                  <ListItemIcon>
                    {getSeverityIcon(vuln.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={vuln.type}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {vuln.description}
                        </Typography>
                        {vuln.line && (
                          <Typography component="span" variant="body2" color="text.secondary">
                            {` (Line ${vuln.line})`}
                          </Typography>
                        )}
                        <Typography component="div" variant="body2" color="success.main" sx={{ mt: 1 }}>
                          Recommendation: {vuln.recommendation}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {results.secureCodeExample && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Secure Implementation Example
                </Typography>
                <SyntaxHighlighter 
                  language={language}
                  style={vs2015}
                  customStyle={{
                    padding: '16px',
                    borderRadius: '4px'
                  }}
                >
                  {results.secureCodeExample}
                </SyntaxHighlighter>
              </Box>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              General Security Recommendations
            </Typography>
            <List>
              {results.suggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
}

export default App;
