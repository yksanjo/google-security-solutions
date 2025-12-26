const express = require('express');
const PromptwareDefender = require('./defender');

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static('public'));

const defender = new PromptwareDefender();

app.post('/api/check', (req, res) => {
  const { input } = req.body;
  const sanitization = defender.sanitizeInput(input);
  res.json(sanitization);
});

app.post('/api/validate', (req, res) => {
  const { response, originalPrompt } = req.body;
  const validation = defender.validateResponse(response, originalPrompt);
  res.json(validation);
});

app.get('/api/patterns', (req, res) => {
  res.json({
    maliciousPatterns: defender.maliciousPatterns,
    injectionTechniques: defender.injectionTechniques
  });
});

app.listen(PORT, () => {
  console.log(`AI Promptware Defender running on http://localhost:${PORT}`);
});

