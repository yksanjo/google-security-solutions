# Chrome Zero-Day Monitor 🔴

## Overview

MVP solution for monitoring and detecting Chrome zero-day vulnerabilities. Addresses critical issues like CVE-2025-10585, CVE-2025-2783, and other actively exploited Chrome zero-days.

## 📸 Screenshot

![Chrome Zero-Day Monitor Dashboard](../screenshots/chrome-monitor.png)
*Real-time monitoring dashboard showing active zero-day vulnerabilities*

## 🎯 Problem Statement

Chrome zero-day vulnerabilities are actively exploited before patches are available, leaving millions of users vulnerable. This tool provides early detection and alerting to help organizations respond quickly.

## Problem Statement

Chrome zero-day vulnerabilities are actively exploited before patches are available, leaving users vulnerable. This tool provides early detection and alerting.

## Solution

Real-time monitoring system that:
- Tracks Chrome security updates
- Monitors CVE database for new Chrome vulnerabilities
- Alerts when zero-days are discovered
- Provides patch status tracking
- Generates security reports

## Features

- ✅ CVE monitoring for Chrome vulnerabilities
- ✅ Zero-day detection and alerting
- ✅ Patch status tracking
- ✅ Security update notifications
- ✅ Risk assessment scoring
- ✅ Web dashboard for visualization

## Installation

```bash
cd chrome-zero-day-monitor
npm install
```

## Usage

### Start Monitor
```bash
npm start
```

### Check for Zero-Days
```bash
node check-zero-days.js
```

### View Dashboard
Open `http://localhost:3000` in your browser

## Configuration

Edit `config.json`:
```json
{
  "checkInterval": 3600000,
  "cveApiUrl": "https://cve.mitre.org/api",
  "chromeVersion": "latest",
  "alertEmail": "security@example.com"
}
```

## Architecture

- **Backend**: Node.js with Express
- **Frontend**: React dashboard
- **Data Source**: CVE database, Chrome security bulletins
- **Storage**: JSON files (can be upgraded to database)

## API Endpoints

- `GET /api/vulnerabilities` - List all Chrome vulnerabilities
- `GET /api/zero-days` - Get active zero-days
- `GET /api/patches` - Get patch status
- `POST /api/check` - Manual check for new vulnerabilities

## Example Output

```json
{
  "zeroDays": [
    {
      "cve": "CVE-2025-10585",
      "severity": "Critical",
      "status": "Actively Exploited",
      "discovered": "2025-09-15",
      "patched": "2025-09-20",
      "cvss": 9.8
    }
  ],
  "totalVulnerabilities": 5,
  "unpatched": 2
}
```

## License

MIT

