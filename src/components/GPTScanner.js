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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  AutoFixHigh as AutoFixIcon
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { analyzeWithGPT } from '../services/gptAnalyzer';

function GPTScanner() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');

  const analyzeCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeWithGPT(code, language);
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
    const extension = file.name.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'ts': 'typescript'
    };
    if (languageMap[extension]) {
      setLanguage(languageMap[extension]);
    }

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PsychologyIcon color="primary" sx={{ fontSize: 30 }} />
            <Typography variant="h6">
              AI-Powered Code Analysis
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Programming Language</InputLabel>
            <Select
              value={language}
              label="Programming Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="csharp">C#</MenuItem>
              <MenuItem value="php">PHP</MenuItem>
              <MenuItem value="ruby">Ruby</MenuItem>
              <MenuItem value="go">Go</MenuItem>
              <MenuItem value="rust">Rust</MenuItem>
              <MenuItem value="typescript">TypeScript</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ minWidth: '200px' }}
            >
              Upload Code File
              <input
                type="file"
                hidden
                accept=".js,.py,.java,.cs,.php,.rb,.go,.rs,.ts"
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
            placeholder="Paste your code here for AI-powered security analysis..."
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={analyzeCode}
            disabled={loading || !code.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoFixIcon />}
          >
            {loading ? 'Analyzing Code...' : 'Analyze with AI'}
          </Button>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>

      {results && (
        <Paper sx={{ p: 3 }}>
          <Alert 
            severity={results.overallRisk.toLowerCase()} 
            sx={{ mb: 3 }}
            icon={getSeverityIcon(results.overallRisk)}
          >
            <Typography variant="subtitle1">
              Overall Risk Level: {results.overallRisk.toUpperCase()}
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            AI Security Analysis Results
          </Typography>
          
          <List>
            {results.issues.map((issue, index) => (
              <ListItem key={index} sx={{ 
                bgcolor: `${getSeverityColor(issue.severity)}15`,
                borderRadius: 1,
                mb: 1,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                  <ListItemIcon>
                    {getSeverityIcon(issue.severity)}
                  </ListItemIcon>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                    <Typography variant="subtitle1" color="text.primary">
                      {issue.type}
                    </Typography>
                    {issue.line && (
                      <Chip 
                        label={`Line ${issue.line}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip 
                      label={issue.severity.toUpperCase()}
                      size="small"
                      color={issue.severity === 'high' ? 'error' : issue.severity === 'medium' ? 'warning' : 'info'}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ pl: 7, width: '100%' }}>
                  <Typography variant="body2" color="text.primary" paragraph>
                    {issue.description}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>

          {results.secureCodeExample && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
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
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Best Practices & Recommendations
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
        </Paper>
      )}
    </Box>
  );
}

export default GPTScanner;
