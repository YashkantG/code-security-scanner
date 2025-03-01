import React, { useState } from 'react';
import { 
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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function GPTScanner() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [scanType, setScanType] = useState('security');

  const analyzeWithGPT = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement GPT-based analysis
      const mockResults = {
        overallRisk: 'medium',
        findings: [
          {
            severity: 'high',
            category: 'Security',
            description: 'Potential SQL injection vulnerability in database query',
            recommendation: 'Use parameterized queries or an ORM to prevent SQL injection',
            explanation: 'The code concatenates user input directly into SQL queries, which could allow attackers to inject malicious SQL commands.'
          },
          {
            severity: 'medium',
            category: 'Best Practices',
            description: 'Inconsistent error handling patterns',
            recommendation: 'Implement consistent error handling using try-catch blocks and proper error logging',
            explanation: 'Different error handling approaches are used throughout the code, making it harder to maintain and debug.'
          }
        ]
      };
      setResults(mockResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
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
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={scanType}
              label="Analysis Type"
              onChange={(e) => setScanType(e.target.value)}
            >
              <MenuItem value="security">Security Analysis</MenuItem>
              <MenuItem value="best-practices">Best Practices Review</MenuItem>
              <MenuItem value="performance">Performance Analysis</MenuItem>
              <MenuItem value="comprehensive">Comprehensive Review</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ minWidth: '200px' }}
            >
              Upload Code
              <input
                type="file"
                hidden
                accept=".js,.py,.java,.cs,.php,.ts,.go,.rb"
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
            placeholder="Paste your code here or upload a file for AI-powered analysis..."
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={analyzeWithGPT}
            disabled={loading || !code.trim()}
            startIcon={<PsychologyIcon />}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze with AI'}
          </Button>
        </Stack>
      </Paper>

      {results && (
        <Box sx={{ mt: 4 }}>
          <Alert 
            severity={results.overallRisk.toLowerCase()} 
            sx={{ mb: 3 }}
          >
            Overall Analysis Results: {results.overallRisk} Risk Level
          </Alert>

          <Typography variant="h6" gutterBottom>
            AI Analysis Findings
          </Typography>
          
          <List>
            {results.findings.map((finding, index) => (
              <ListItem key={index} sx={{ 
                bgcolor: `${getSeverityColor(finding.severity)}15`,
                borderRadius: 1,
                mb: 1 
              }}>
                <ListItemIcon>
                  {getSeverityIcon(finding.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={`${finding.category}: ${finding.description}`}
                  secondary={
                    <>
                      <Typography component="div" variant="body2" color="text.primary" sx={{ mt: 1 }}>
                        {finding.explanation}
                      </Typography>
                      <Typography component="div" variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Recommendation: {finding.recommendation}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default GPTScanner;
