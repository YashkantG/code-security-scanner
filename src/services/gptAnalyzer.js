import axios from 'axios';

export const analyzeWithGPT = async (code, language) => {
  try {
    // This would be replaced with your actual GPT API endpoint and key
    const API_ENDPOINT = process.env.REACT_APP_GPT_API_ENDPOINT;
    const API_KEY = process.env.REACT_APP_GPT_API_KEY;

    if (!API_ENDPOINT || !API_KEY) {
      throw new Error('GPT API configuration is missing. Please set REACT_APP_GPT_API_ENDPOINT and REACT_APP_GPT_API_KEY in your environment.');
    }

    const prompt = `
      Analyze the following ${language} code for security vulnerabilities, code quality issues, and potential bugs.
      Focus on:
      1. Security vulnerabilities (XSS, SQL injection, etc.)
      2. Input validation issues
      3. Authentication/Authorization concerns
      4. Data exposure risks
      5. Code quality and best practices
      6. Performance considerations

      Code to analyze:
      ${code}

      Provide a detailed analysis including:
      - Severity level for each issue (high/medium/low)
      - Description of each vulnerability or issue
      - Location in code (if applicable)
      - Recommendations for fixing
      - Secure code examples where relevant
      - General best practices
    `;

    const response = await axios.post(API_ENDPOINT, {
      model: "gpt-4", // or your preferred model
      messages: [
        {
          role: "system",
          content: "You are a security-focused code analysis assistant. Analyze code for security issues and provide detailed, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Process and structure the GPT response
    const analysis = response.data.choices[0].message.content;
    
    // For demonstration, return mock structured data
    // In production, you would parse the GPT response into this structure
    return {
      valid: true,
      overallRisk: 'medium',
      issues: [
        {
          severity: 'high',
          type: 'Input Validation',
          description: 'User input is not properly sanitized before processing',
          line: 15,
          recommendation: 'Use input validation libraries or implement strict validation'
        },
        {
          severity: 'medium',
          type: 'Authentication',
          description: 'Weak password requirements in authentication logic',
          line: 23,
          recommendation: 'Implement strong password policies and use secure hashing'
        }
      ],
      suggestions: [
        'Implement proper input validation',
        'Use secure authentication methods',
        'Follow secure coding guidelines',
        'Regular security audits'
      ],
      secureCodeExample: '// Example of secure implementation\n' +
        'function validateInput(userInput) {\n' +
        '  // Sanitize and validate input\n' +
        '  return sanitizedInput;\n' +
        '}'
    };
  } catch (error) {
    console.error('GPT Analysis Error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error analyzing code with GPT');
  }
};
