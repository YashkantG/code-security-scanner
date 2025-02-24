// Simple security analyzer that checks for common security issues
const analyzePatterns = (code) => {
  const issues = [];
  
  // Check for eval usage
  if (/\beval\s*\(/.test(code)) {
    issues.push({
      severity: 'high',
      type: 'Command Injection',
      line: code.split('\n').findIndex(line => line.includes('eval')) + 1,
      description: 'Using eval() can execute arbitrary JavaScript code and is extremely dangerous',
      recommendation: 'Avoid using eval(). Use safer alternatives like JSON.parse() for JSON data.'
    });
  }

  // Check for innerHTML usage
  if (/\.innerHTML\s*=/.test(code)) {
    issues.push({
      severity: 'high',
      type: 'Cross-Site Scripting (XSS)',
      line: code.split('\n').findIndex(line => line.includes('innerHTML')) + 1,
      description: 'Using innerHTML can lead to XSS vulnerabilities',
      recommendation: 'Use textContent or createElement instead of innerHTML'
    });
  }

  // Check for setTimeout/setInterval with string argument
  if (/set(?:Timeout|Interval)\s*\(\s*["']/.test(code)) {
    issues.push({
      severity: 'high',
      type: 'Command Injection',
      line: code.split('\n').findIndex(line => /set(?:Timeout|Interval)\s*\(\s*["']/.test(line)) + 1,
      description: 'Using setTimeout/setInterval with string arguments is similar to eval() and poses security risks',
      recommendation: 'Use functions instead of strings with setTimeout/setInterval'
    });
  }

  // Check for document.write usage
  if (/document\.write\s*\(/.test(code)) {
    issues.push({
      severity: 'medium',
      type: 'Cross-Site Scripting (XSS)',
      line: code.split('\n').findIndex(line => line.includes('document.write')) + 1,
      description: 'document.write can lead to XSS vulnerabilities and is bad for performance',
      recommendation: 'Use DOM manipulation methods instead of document.write'
    });
  }

  // Check for alert/confirm/prompt usage
  if (/\b(alert|confirm|prompt)\s*\(/.test(code)) {
    issues.push({
      severity: 'low',
      type: 'User Experience',
      line: code.split('\n').findIndex(line => /\b(alert|confirm|prompt)\s*\(/.test(line)) + 1,
      description: 'Using alert/confirm/prompt is bad for user experience and can expose sensitive information',
      recommendation: 'Use custom modal dialogs instead of browser native popups'
    });
  }

  // Check for console.log usage
  if (/console\.(log|debug|info|warn|error)\s*\(/.test(code)) {
    issues.push({
      severity: 'low',
      type: 'Information Leakage',
      line: code.split('\n').findIndex(line => /console\.(log|debug|info|warn|error)\s*\(/.test(line)) + 1,
      description: 'Console logs may expose sensitive information in production',
      recommendation: 'Remove console logs or use proper logging service in production'
    });
  }

  // Check for debugger statements
  if (/\bdebugger\b/.test(code)) {
    issues.push({
      severity: 'medium',
      type: 'Development Artifact',
      line: code.split('\n').findIndex(line => line.includes('debugger')) + 1,
      description: 'Debugger statements should not be present in production code',
      recommendation: 'Remove all debugger statements before deployment'
    });
  }

  // Check for potentially unsafe regular expressions
  if (/new RegExp\(.*\+.*\)/.test(code)) {
    issues.push({
      severity: 'high',
      type: 'Regular Expression Injection',
      line: code.split('\n').findIndex(line => /new RegExp\(.*\+.*\)/.test(line)) + 1,
      description: 'Dynamic regular expressions can lead to ReDoS attacks',
      recommendation: 'Use static regular expressions or validate dynamic parts carefully'
    });
  }

  // Check for potentially unsafe jQuery usage
  if (/\$\(.*\)\.html\(/.test(code)) {
    issues.push({
      severity: 'high',
      type: 'Cross-Site Scripting (XSS)',
      line: code.split('\n').findIndex(line => /\$\(.*\)\.html\(/.test(line)) + 1,
      description: 'Using jQuery .html() with untrusted content can lead to XSS',
      recommendation: 'Use .text() instead of .html() or sanitize content properly'
    });
  }

  return issues;
};

export const analyzeCode = async (code, language) => {
  try {
    const vulnerabilities = analyzePatterns(code);
    const secureExample = generateSecureExample(code, vulnerabilities);

    return {
      vulnerabilities,
      suggestions: generateSuggestions(vulnerabilities),
      overallRisk: calculateOverallRisk(vulnerabilities),
      secureCodeExample: secureExample,
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw new Error('Failed to analyze code. Please check your code and try again.');
  }
};

function calculateOverallRisk(vulnerabilities) {
  if (vulnerabilities.some(v => v.severity === 'high')) return 'high';
  if (vulnerabilities.some(v => v.severity === 'medium')) return 'medium';
  return vulnerabilities.length > 0 ? 'low' : 'safe';
}

function generateSuggestions(vulnerabilities) {
  const suggestions = new Set();
  
  vulnerabilities.forEach(vuln => {
    if (vuln.recommendation) {
      suggestions.add(vuln.recommendation);
    }
  });

  // Add general security best practices
  suggestions.add('Regularly update dependencies to patch security vulnerabilities');
  suggestions.add('Implement proper input validation and sanitization');
  suggestions.add('Use security headers and enable HTTPS');
  suggestions.add('Implement Content Security Policy (CSP)');
  suggestions.add('Use HTTPS-only cookies with appropriate flags');
  suggestions.add('Implement proper error handling without exposing sensitive details');
  
  return Array.from(suggestions);
}

function generateSecureExample(code, vulnerabilities) {
  if (vulnerabilities.length === 0) return null;

  // Basic secure code examples based on common issues
  if (code.includes('eval(')) {
    return `// Instead of eval, use safer alternatives:
const jsonData = JSON.parse(jsonString);

// For dynamic property access:
const obj = {
  prop1: 'value1',
  prop2: 'value2'
};
const prop = 'prop1';
const value = obj[prop]; // Safe way to access properties dynamically`;
  }

  if (code.includes('innerHTML')) {
    return `// Instead of innerHTML, use safer alternatives:
// 1. For text content:
element.textContent = sanitizedContent;

// 2. For creating elements:
const newElement = document.createElement('div');
newElement.textContent = sanitizedContent;
parentElement.appendChild(newElement);`;
  }

  if (code.includes('setTimeout') && code.includes('"')) {
    return `// Instead of setTimeout with string:
// Bad:
setTimeout("doSomething()", 1000);

// Good:
setTimeout(() => {
  doSomething();
}, 1000);`;
  }

  if (code.includes('document.write')) {
    return `// Instead of document.write, use modern DOM manipulation:
// Bad:
document.write('<h1>Hello</h1>');

// Good:
const heading = document.createElement('h1');
heading.textContent = 'Hello';
document.body.appendChild(heading);`;
  }

  if (code.includes('RegExp(') && code.includes('+')) {
    return `// Instead of dynamic RegExp, use static patterns:
// Bad:
const userInput = 'hello';
const regex = new RegExp(userInput + '.*');

// Good:
const regex = /^[a-zA-Z]+.*$/;
// Or if dynamic is necessary, validate the pattern:
if (/^[a-zA-Z]+$/.test(userInput)) {
  const regex = new RegExp(userInput + '.*');
}`;
  }

  return null;
}
