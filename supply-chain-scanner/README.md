# Supply Chain Scanner 🔵

## Overview

MVP solution for scanning open source dependencies for vulnerabilities. Addresses the 20+ vulnerabilities found in Google's open source dependencies.

## 📸 Screenshot

![Supply Chain Scanner](../screenshots/supply-chain-scan.png)
*Scanning dependencies and identifying vulnerable packages*

## 🎯 Problem Statement

Open source dependencies can introduce known vulnerabilities (20+ found in Google's dependencies), supply chain attacks, and outdated packages with security flaws. This tool helps maintain secure dependencies.

## Problem Statement

Open source dependencies can introduce:
- Known vulnerabilities (20+ found in Google's dependencies)
- Supply chain attacks
- Outdated packages with security flaws
- Transitive dependency risks

## Solution

Automated dependency scanner that:
- Scans package.json/requirements.txt
- Checks CVE database for known vulnerabilities
- Identifies outdated packages
- Provides update recommendations
- Generates security reports

## Features

- ✅ Dependency scanning
- ✅ CVE vulnerability checking
- ✅ Outdated package detection
- ✅ Update recommendations
- ✅ Security report generation
- ✅ CI/CD integration

## Installation

```bash
cd supply-chain-scanner
pip install -r requirements.txt
```

## Usage

### Scan Project
```bash
python scan.py --path ./project
```

### Check Specific Package
```bash
python scan.py --package express
```

### Generate Report
```bash
python scan.py --path ./project --report
```

## License

MIT

