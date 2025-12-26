#!/usr/bin/env node

const ExtensionAnalyzer = require('./analyzer');
const path = require('path');

async function main() {
  const extensionPath = process.argv[2];
  
  if (!extensionPath) {
    console.log('Usage: node analyze.js <extension-path>');
    console.log('Example: node analyze.js ./extensions/suspicious-extension');
    process.exit(1);
  }

  const analyzer = new ExtensionAnalyzer();
  
  try {
    console.log(`\n🔍 Analyzing extension: ${extensionPath}\n`);
    
    const analysis = await analyzer.analyzeExtension(extensionPath);
    
    // Check for Phantom Shuttle patterns
    const phantomShuttlePatterns = analyzer.detectPhantomShuttlePatterns(analysis);
    
    console.log('='.repeat(60));
    console.log('EXTENSION SECURITY ANALYSIS');
    console.log('='.repeat(60));
    console.log(`Name: ${analysis.name}`);
    console.log(`Version: ${analysis.version}`);
    console.log(`Risk Score: ${analysis.riskScore}/100`);
    console.log(`Risk Level: ${analysis.riskLevel.toUpperCase()}`);
    console.log('\nPermissions:');
    analysis.permissions.forEach(p => console.log(`  - ${p}`));
    
    if (analysis.issues.length > 0) {
      console.log('\n⚠️  Issues Detected:');
      analysis.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (phantomShuttlePatterns.length > 0) {
      console.log('\n🚨 PHANTOM SHUTTLE PATTERNS DETECTED:');
      phantomShuttlePatterns.forEach(pattern => console.log(`  - ${pattern}`));
    }
    
    if (analysis.recommendations.length > 0) {
      console.log('\n📋 Recommendations:');
      analysis.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Exit with error code if high risk
    if (analysis.riskLevel === 'High') {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();

