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
  Stack
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function OpenAPIScanner() {
  const [spec, setSpec] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const analyzeOpenAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement OpenAPI security analysis
      const mockResults = {
        overallRisk: 'medium',
        issues: [
          {
            severity: 'high',
            type: 'Authentication',
            description: 'API endpoints lack proper authentication mechanisms',
            path: '/api/users',
            recommendation: 'Implement OAuth2 or JWT authentication'
          },
          {
            severity: 'medium',
            type: 'Data Exposure',
            description: 'Sensitive data fields in responses',
            path: '/api/user/{id}',
            recommendation: 'Use response filtering or data masking'
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
      setSpec(e.target.result);
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ minWidth: '200px' }}
            >
              Upload OpenAPI Spec
              <input
                type="file"
                hidden
                accept=".json,.yaml,.yml"
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
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            placeholder="Paste your OpenAPI specification here or upload a file..."
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={analyzeOpenAPI}
            disabled={loading || !spec.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze OpenAPI Spec'}
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
            {results.issues.map((issue, index) => (
              <ListItem key={index} sx={{ 
                bgcolor: `${getSeverityColor(issue.severity)}15`,
                borderRadius: 1,
                mb: 1 
              }}>
                <ListItemIcon>
                  {getSeverityIcon(issue.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={issue.type}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {issue.description}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {` (Path: ${issue.path})`}
                      </Typography>
                      <Typography component="div" variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Recommendation: {issue.recommendation}
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

export default OpenAPIScanner;
