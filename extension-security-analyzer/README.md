# Extension Security Analyzer 🟡

## Overview

MVP solution for detecting malicious Chrome extensions like Phantom Shuttle. Addresses the issue of extensions that steal data from 170+ domains and operate undetected for years.

## 📸 Screenshot

![Extension Security Analyzer](../screenshots/extension-analyzer.png)
*Analyzing extension permissions and detecting malicious patterns*

## 🎯 Problem Statement

Malicious Chrome extensions can operate undetected for years (Phantom Shuttle: 8+ years), stealing credentials and payment information from hundreds of domains. This tool helps identify these threats before they cause damage.

## Problem Statement

Malicious Chrome extensions can:
- Reroute traffic through attacker-controlled proxies
- Steal credentials and payment information
- Operate undetected for years (Phantom Shuttle: 8+ years)
- Compromise data from hundreds of domains

## Solution

Automated extension security analyzer that:
- Scans extension permissions
- Detects suspicious network behavior
- Identifies proxy rerouting
- Flags data exfiltration patterns
- Analyzes extension code for malicious patterns

## Features

- ✅ Permission analysis and risk scoring
- ✅ Network traffic monitoring
- ✅ Proxy detection
- ✅ Code pattern analysis
- ✅ Behavioral analysis
- ✅ Risk assessment report

## Installation

```bash
cd extension-security-analyzer
npm install
```

## Usage

### Analyze Extension
```bash
node analyze.js path/to/extension.crx
```

### Scan Installed Extensions
```bash
node scan-installed.js
```

### Web Interface
```bash
npm start
# Open http://localhost:3001
```

## Detection Patterns

### Red Flags
- Requests for `webRequest` permission with all URLs
- Proxy configuration changes
- Traffic rerouting patterns
- Excessive data collection
- Suspicious network requests
- Code obfuscation

### Risk Scoring
- **High Risk**: Proxy rerouting, broad permissions, data exfiltration
- **Medium Risk**: Suspicious patterns, excessive permissions
- **Low Risk**: Normal extension behavior

## Example Output

```json
{
  "extensionId": "abc123",
  "name": "Suspicious Extension",
  "riskScore": 85,
  "riskLevel": "High",
  "issues": [
    "Requests webRequest permission for all URLs",
    "Detected proxy rerouting",
    "Suspicious network patterns"
  ],
  "recommendation": "Remove extension immediately"
}
```

## License

MIT

