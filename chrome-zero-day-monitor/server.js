const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Chrome zero-day CVEs from analysis
const knownZeroDays = [
  { cve: 'CVE-2025-10585', severity: 'Critical', component: 'V8 Engine', cvss: 9.8 },
  { cve: 'CVE-2025-14174', severity: 'Critical', component: 'ANGLE', cvss: 9.8 },
  { cve: 'CVE-2025-2783', severity: 'Critical', component: 'Mojo IPC', cvss: 9.1 },
  { cve: 'CVE-2025-4664', severity: 'Critical', component: 'Loader', cvss: 8.8 },
  { cve: 'CVE-2025-6554', severity: 'Critical', component: 'V8 Engine', cvss: 9.8 }
];

// Store vulnerabilities
let vulnerabilities = [];

// Load vulnerabilities from file
async function loadVulnerabilities() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'vulnerabilities.json'), 'utf8');
    vulnerabilities = JSON.parse(data);
  } catch (error) {
    vulnerabilities = knownZeroDays.map(v => ({
      ...v,
      status: 'Actively Exploited',
      discovered: '2025',
      patched: null,
      alertSent: false
    }));
    await saveVulnerabilities();
  }
}

async function saveVulnerabilities() {
  await fs.writeFile(
    path.join(__dirname, 'vulnerabilities.json'),
    JSON.stringify(vulnerabilities, null, 2)
  );
}

// Check for new zero-days (simulated - in production, would query CVE API)
async function checkForZeroDays() {
  console.log('Checking for new Chrome zero-days...');
  
  // Simulate checking CVE database
  // In production, this would query actual CVE API
  const newZeroDays = vulnerabilities.filter(v => 
    v.status === 'Actively Exploited' && !v.patched
  );
  
  return newZeroDays;
}

// API Routes
app.get('/api/vulnerabilities', (req, res) => {
  res.json(vulnerabilities);
});

app.get('/api/zero-days', async (req, res) => {
  const zeroDays = await checkForZeroDays();
  res.json({
    zeroDays,
    total: zeroDays.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
    unpatched: vulnerabilities.filter(v => !v.patched).length,
    activelyExploited: vulnerabilities.filter(v => v.status === 'Actively Exploited').length,
    averageCvss: vulnerabilities.reduce((sum, v) => sum + (v.cvss || 0), 0) / vulnerabilities.length
  };
  res.json(stats);
});

app.post('/api/check', async (req, res) => {
  const zeroDays = await checkForZeroDays();
  res.json({
    message: 'Check completed',
    zeroDaysFound: zeroDays.length,
    zeroDays
  });
});

// Cron job to check every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled zero-day check...');
  const zeroDays = await checkForZeroDays();
  if (zeroDays.length > 0) {
    console.log(`⚠️  Alert: ${zeroDays.length} active zero-days detected!`);
    // In production, send alerts via email/SMS/Slack
  }
});

// Initialize
loadVulnerabilities().then(() => {
  app.listen(PORT, () => {
    console.log(`Chrome Zero-Day Monitor running on http://localhost:${PORT}`);
    console.log(`Monitoring ${vulnerabilities.length} known vulnerabilities`);
  });
});

