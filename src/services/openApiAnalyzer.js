import SwaggerParser from '@apidevtools/swagger-parser';
import yaml from 'js-yaml';

const checkAuthenticationSecurity = (spec) => {
  const issues = [];
  
  // Check global security
  if (!spec.security && !spec.securityDefinitions && !spec.components?.securitySchemes) {
    issues.push({
      severity: 'high',
      type: 'Authentication',
      description: 'No global security schemes defined',
      path: 'root',
      recommendation: 'Define security schemes (e.g., OAuth2, API Key) in components.securitySchemes'
    });
  }

  // Check endpoints security
  Object.entries(spec.paths || {}).forEach(([path, pathObj]) => {
    Object.entries(pathObj || {}).forEach(([method, operation]) => {
      if (!operation.security && !spec.security) {
        issues.push({
          severity: 'high',
          type: 'Authentication',
          description: `Endpoint ${method.toUpperCase()} ${path} has no security requirements`,
          path: `paths.${path}.${method}`,
          recommendation: 'Add security requirements to protect the endpoint'
        });
      }
    });
  });

  return issues;
};

const checkDataExposure = (spec) => {
  const issues = [];
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credit', 'ssn', 'social'];

  // Check response schemas
  Object.entries(spec.paths || {}).forEach(([path, pathObj]) => {
    Object.entries(pathObj || {}).forEach(([method, operation]) => {
      Object.entries(operation.responses || {}).forEach(([code, response]) => {
        const schema = response.content?.['application/json']?.schema;
        if (schema) {
          sensitiveFields.forEach(field => {
            if (JSON.stringify(schema).toLowerCase().includes(field)) {
              issues.push({
                severity: 'medium',
                type: 'Data Exposure',
                description: `Potential sensitive data exposure in ${method.toUpperCase()} ${path} response`,
                path: `paths.${path}.${method}.responses.${code}`,
                recommendation: 'Review response schema and ensure sensitive data is not exposed'
              });
            }
          });
        }
      });
    });
  });

  return issues;
};

const checkRateLimiting = (spec) => {
  const issues = [];
  
  // Check for rate limiting headers or parameters
  const hasRateLimiting = spec.components?.headers?.['X-RateLimit-Limit'] ||
    spec.components?.parameters?.['rate-limit'] ||
    JSON.stringify(spec).toLowerCase().includes('ratelimit');

  if (!hasRateLimiting) {
    issues.push({
      severity: 'medium',
      type: 'Rate Limiting',
      description: 'No rate limiting mechanisms detected',
      path: 'root',
      recommendation: 'Implement rate limiting using headers (X-RateLimit-*) or other mechanisms'
    });
  }

  return issues;
};

const checkInputValidation = (spec) => {
  const issues = [];

  // Check request parameters and schemas
  Object.entries(spec.paths || {}).forEach(([path, pathObj]) => {
    Object.entries(pathObj || {}).forEach(([method, operation]) => {
      // Check path parameters
      (operation.parameters || []).forEach(param => {
        if (!param.schema && !param.type) {
          issues.push({
            severity: 'medium',
            type: 'Input Validation',
            description: `Parameter ${param.name} lacks schema definition`,
            path: `paths.${path}.${method}.parameters`,
            recommendation: 'Define schema with proper type and format constraints'
          });
        }
      });

      // Check request body
      if (operation.requestBody) {
        const schema = operation.requestBody.content?.['application/json']?.schema;
        if (!schema) {
          issues.push({
            severity: 'medium',
            type: 'Input Validation',
            description: `Request body schema missing in ${method.toUpperCase()} ${path}`,
            path: `paths.${path}.${method}.requestBody`,
            recommendation: 'Define request body schema with proper validation constraints'
          });
        }
      }
    });
  });

  return issues;
};

export const analyzeOpenAPI = async (specContent) => {
  try {
    // Parse the spec content (supports both JSON and YAML)
    let spec;
    try {
      spec = JSON.parse(specContent);
    } catch {
      spec = yaml.load(specContent);
    }

    // Validate the spec
    await SwaggerParser.validate(spec);

    // Perform security analysis
    const issues = [
      ...checkAuthenticationSecurity(spec),
      ...checkDataExposure(spec),
      ...checkRateLimiting(spec),
      ...checkInputValidation(spec)
    ];

    // Calculate overall risk
    const severityCounts = {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    };

    let overallRisk = 'low';
    if (severityCounts.high > 0) {
      overallRisk = 'high';
    } else if (severityCounts.medium > 0) {
      overallRisk = 'medium';
    }

    // Generate recommendations
    const recommendations = [
      'Always use HTTPS for API endpoints',
      'Implement proper authentication and authorization',
      'Use rate limiting to prevent abuse',
      'Validate all input parameters',
      'Implement proper error handling',
      'Use appropriate HTTP methods',
      'Version your API endpoints'
    ];

    return {
      valid: true,
      overallRisk,
      issues,
      recommendations
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};
