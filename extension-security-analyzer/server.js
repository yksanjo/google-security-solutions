const express = require('express');
const ExtensionAnalyzer = require('./analyzer');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

const analyzer = new ExtensionAnalyzer();

// Example extension data (in production, would scan actual extensions)
const exampleExtensions = [
  {
    id: 'ext1',
    name: 'Legitimate Extension',
    permissions: ['activeTab'],
    riskScore: 15,
    riskLevel: 'Low'
  },
  {
    id: 'ext2',
    name: 'Suspicious Extension',
    permissions: ['webRequest', '<all_urls>', 'proxy'],
    riskScore: 85,
    riskLevel: 'High'
  }
];

app.get('/api/extensions', (req, res) => {
  res.json(exampleExtensions);
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { extensionPath } = req.body;
    const analysis = await analyzer.analyzeExtension(extensionPath);
    const phantomShuttlePatterns = analyzer.detectPhantomShuttlePatterns(analysis);
    
    res.json({
      ...analysis,
      phantomShuttlePatterns
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/phantom-shuttle-info', (req, res) => {
  res.json({
    description: 'Phantom Shuttle was a malicious Chrome extension active since 2017',
    characteristics: [
      'Reroutes traffic through attacker-controlled proxies',
      'Requests webRequest permission for all URLs',
      'Steals data from 170+ high-profile domains',
      'Operated undetected for 8+ years',
      'Compromises credentials and payment information'
    ],
    detection: [
      'Check for proxy permissions',
      'Monitor for traffic rerouting',
      'Analyze network requests',
      'Review extension permissions'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Extension Security Analyzer running on http://localhost:${PORT}`);
});

