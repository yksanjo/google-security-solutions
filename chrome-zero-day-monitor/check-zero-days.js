#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function checkZeroDays() {
  console.log('🔍 Checking for Chrome zero-day vulnerabilities...\n');
  
  try {
    // In production, this would query actual CVE API
    // For MVP, we'll check known vulnerabilities
    const response = await axios.get('http://localhost:3000/api/zero-days');
    const data = response.data;
    
    if (data.zeroDays.length === 0) {
      console.log('✅ No active zero-days detected.');
      return;
    }
    
    console.log(`⚠️  ALERT: ${data.zeroDays.length} active zero-day(s) detected!\n`);
    
    data.zeroDays.forEach(vuln => {
      console.log(`CVE: ${vuln.cve}`);
      console.log(`Severity: ${vuln.severity}`);
      console.log(`Component: ${vuln.component}`);
      console.log(`CVSS Score: ${vuln.cvss}`);
      console.log(`Status: ${vuln.status}`);
      console.log('---');
    });
    
    console.log('\n⚠️  Immediate action required:');
    console.log('1. Update Chrome to latest version');
    console.log('2. Enable automatic updates');
    console.log('3. Monitor for patches');
    console.log('4. Consider temporary workarounds if available');
    
  } catch (error) {
    console.error('Error checking zero-days:', error.message);
    console.log('\nMake sure the monitor server is running: npm start');
  }
}

checkZeroDays();

