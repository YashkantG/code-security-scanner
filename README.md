# Code Security Scanner

A comprehensive security scanning tool for code analysis, featuring multiple specialized scanners:

## Features

### 1. Code Scanner
- Static code analysis for security vulnerabilities
- Support for multiple programming languages
- Real-time code analysis
- Detailed security recommendations

### 2. OpenAPI Scanner
- Analyze OpenAPI/Swagger specifications
- Check for API security best practices
- Authentication and authorization validation
- Data exposure risk assessment
- Input validation verification

### 3. GPT Scanner (AI-Powered Analysis)
- AI-powered code security analysis
- Intelligent vulnerability detection
- Code quality assessment
- Best practices recommendations
- Performance optimization suggestions
- Support for multiple programming languages

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/code-security-scanner.git
cd code-security-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:
```env
REACT_APP_GPT_API_ENDPOINT=your_gpt_api_endpoint
REACT_APP_GPT_API_KEY=your_gpt_api_key
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Code Scanner
1. Select the programming language
2. Upload a code file or paste code directly
3. Click "Analyze Code" to get security analysis results

### OpenAPI Scanner
1. Upload an OpenAPI specification file (JSON/YAML)
2. Or paste the specification directly
3. Click "Analyze OpenAPI Specification" to check for security issues

### GPT Scanner
1. Select the programming language
2. Upload a code file or paste code directly
3. Click "Analyze with AI" for intelligent code analysis
4. Review AI-generated security recommendations

## Environment Variables

The application requires the following environment variables:

- `REACT_APP_GPT_API_ENDPOINT`: Your GPT API endpoint (e.g., OpenAI API endpoint)
- `REACT_APP_GPT_API_KEY`: Your GPT API key for authentication

You can obtain these by:
1. Setting up an account with OpenAI or your preferred AI provider
2. Creating an API key in your account dashboard
3. Adding these to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
