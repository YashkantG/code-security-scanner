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
  Chip
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Api as ApiIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { analyzeOpenAPI } from '../services/openApiAnalyzer';

function OpenAPIScanner() {
  const [spec, setSpec] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const analyzeSpec = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeOpenAPI(spec);
      if (!analysis.valid) {
        throw new Error(analysis.error);
      }
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
            placeholder="Paste your OpenAPI specification here or upload a file (JSON or YAML format)..."
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={analyzeSpec}
            disabled={loading || !spec.trim()}
            startIcon={<ApiIcon />}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze OpenAPI Specification'}
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          <Alert 
            severity={results.overallRisk.toLowerCase()} 
            sx={{ mb: 3 }}
          >
            Overall Risk Level: {results.overallRisk.toUpperCase()}
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
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {issue.type}
                      <Chip 
                        label={issue.path} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="div" variant="body2" color="text.primary" sx={{ mt: 1 }}>
                        {issue.description}
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

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            General API Security Recommendations
          </Typography>
          <List>
            {results.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default OpenAPIScanner;
