# Code Security Scanner

A modern React application that performs static code analysis to identify security vulnerabilities and best practices violations in your code. Built with ESLint and security-focused rules.

## Features

- Local static code analysis (no API keys needed)
- File upload support with automatic language detection
- Security vulnerability detection:
  - Command injection vulnerabilities
  - Cross-site scripting (XSS)
  - Buffer manipulation issues
  - Information disclosure risks
  - Unsafe regular expressions
  - Timing attack vulnerabilities
  - And more...
- Modern, responsive Material-UI interface
- Real-time code analysis with syntax highlighting
- Support for multiple programming languages
- Detailed vulnerability reporting with severity levels
- Actionable security recommendations
- Secure code examples
- Beautiful syntax highlighting for code input and output

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. Choose how to input your code:
   - Upload a file using the "Upload File" button (supports .js, .py, .java, .cs, .php)
   - Paste your code directly into the editor
2. The programming language will be automatically detected for uploaded files, or you can select it manually from the dropdown
3. Click "Analyze Code" to scan for vulnerabilities
4. Review the detailed analysis:
   - Overall risk level
   - Specific vulnerabilities with severity levels
   - Line numbers where issues were found
   - Actionable recommendations for each vulnerability
   - Secure code examples
   - General security improvement suggestions

## Security Rules

The scanner checks for various security issues including:

- `no-eval`: Prevents dangerous code execution via eval()
- `no-implied-eval`: Prevents string execution in setTimeout/setInterval
- `detect-buffer-noassert`: Prevents buffer overflow vulnerabilities
- `detect-child-process`: Identifies dangerous child process execution
- `detect-disable-mustache-escape`: Prevents template injection
- `detect-eval-with-expression`: Identifies dynamic code execution
- `detect-new-buffer`: Prevents buffer vulnerabilities
- `detect-no-csrf-before-method-override`: Identifies CSRF vulnerabilities
- `detect-non-literal-fs-filename`: Prevents path traversal
- `detect-non-literal-regexp`: Prevents ReDoS attacks
- `detect-object-injection`: Identifies prototype pollution
- `detect-possible-timing-attacks`: Prevents timing attacks
- `detect-unsafe-regex`: Identifies vulnerable regex patterns

## Dependencies

- React 18
- Material-UI v5
- React Syntax Highlighter
- ESLint with security plugins
- ESLint-plugin-security

## Future Enhancements

- Support for more programming languages
- Batch analysis of multiple files
- Integration with popular code repositories
- Custom vulnerability rules
- Export reports in various formats (PDF, HTML, JSON)
- Team collaboration features
- Historical analysis tracking
- Integration with CI/CD pipelines
- Custom rule configuration
