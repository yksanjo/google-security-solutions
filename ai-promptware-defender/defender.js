class PromptwareDefender {
  constructor() {
    this.maliciousPatterns = [
      'ignore previous instructions',
      'system override',
      'bypass safety',
      'extract data',
      'reveal location',
      'send spam',
      'leak messages',
      'forget safety guidelines',
      'disregard constraints',
      'execute command'
    ];

    this.injectionTechniques = [
      'prompt injection',
      'instruction override',
      'context manipulation',
      'jailbreak',
      'roleplay attack',
      'encoding bypass'
    ];
  }

  sanitizeInput(userInput) {
    if (!userInput || typeof userInput !== 'string') {
      return { safe: false, reason: 'Invalid input' };
    }

    const input = userInput.toLowerCase();
    
    // Check for malicious patterns
    for (const pattern of this.maliciousPatterns) {
      if (input.includes(pattern.toLowerCase())) {
        return {
          safe: false,
          reason: `Detected malicious pattern: ${pattern}`,
          pattern: pattern
        };
      }
    }

    // Check for injection techniques
    for (const technique of this.injectionTechniques) {
      if (input.includes(technique.toLowerCase())) {
        return {
          safe: false,
          reason: `Detected injection technique: ${technique}`,
          technique: technique
        };
      }
    }

    // Check for suspicious length (very long inputs might be obfuscated)
    if (userInput.length > 10000) {
      return {
        safe: false,
        reason: 'Input too long - possible obfuscation'
      };
    }

    return { safe: true };
  }

  validateResponse(response, originalPrompt) {
    const issues = [];

    // Check if response contains sensitive data
    const sensitivePatterns = [
      /location:?\s*[\d.-]+/i,
      /password:?\s*\w+/i,
      /api[_-]?key:?\s*\w+/i,
      /token:?\s*\w+/i
    ];

    sensitivePatterns.forEach(pattern => {
      if (pattern.test(response)) {
        issues.push('Response may contain sensitive data');
      }
    });

    // Check if response attempts unauthorized actions
    const actionPatterns = [
      /send\s+email/i,
      /generate\s+spam/i,
      /reveal\s+location/i,
      /leak\s+messages/i
    ];

    actionPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        issues.push('Response may attempt unauthorized actions');
      }
    });

    return {
      safe: issues.length === 0,
      issues: issues
    };
  }

  testPromptInjection(testCases) {
    const results = [];

    testCases.forEach(testCase => {
      const sanitization = this.sanitizeInput(testCase.input);
      const result = {
        testCase: testCase.name,
        input: testCase.input,
        sanitizationResult: sanitization,
        vulnerable: !sanitization.safe
      };

      results.push(result);
    });

    return results;
  }

  generateDefenseRecommendations(vulnerabilities) {
    const recommendations = [];

    if (vulnerabilities.some(v => v.includes('prompt injection'))) {
      recommendations.push('Implement input sanitization');
      recommendations.push('Add prompt validation layers');
      recommendations.push('Use context isolation');
    }

    if (vulnerabilities.some(v => v.includes('data leak'))) {
      recommendations.push('Implement output filtering');
      recommendations.push('Add data access controls');
      recommendations.push('Enable audit logging');
    }

    if (vulnerabilities.some(v => v.includes('unauthorized action'))) {
      recommendations.push('Require user confirmation for actions');
      recommendations.push('Implement rate limiting');
      recommendations.push('Add action validation');
    }

    return recommendations;
  }
}

module.exports = PromptwareDefender;

