const JSZip = require('jszip');
const fs = require('fs').promises;
const path = require('path');

class ExtensionAnalyzer {
  constructor() {
    this.riskPatterns = {
      proxyRerouting: [
        'proxy',
        'redirect',
        'intercept',
        'modifyRequest',
        'modifyResponse'
      ],
      dataExfiltration: [
        'sendBeacon',
        'fetch',
        'xmlhttprequest',
        'postMessage',
        'chrome.storage'
      ],
      suspiciousPermissions: [
        'webRequest',
        'webRequestBlocking',
        'proxy',
        'tabs',
        'cookies',
        'storage'
      ]
    };
  }

  async analyzeExtension(extensionPath) {
    try {
      const extensionData = await this.loadExtension(extensionPath);
      const manifest = extensionData.manifest;
      
      const analysis = {
        id: manifest.name || 'unknown',
        name: manifest.name,
        version: manifest.version,
        permissions: manifest.permissions || [],
        riskScore: 0,
        riskLevel: 'Low',
        issues: [],
        recommendations: []
      };

      // Analyze permissions
      const permissionAnalysis = this.analyzePermissions(manifest.permissions || []);
      analysis.riskScore += permissionAnalysis.riskScore;
      analysis.issues.push(...permissionAnalysis.issues);

      // Analyze content scripts
      const contentScriptAnalysis = this.analyzeContentScripts(manifest.content_scripts || []);
      analysis.riskScore += contentScriptAnalysis.riskScore;
      analysis.issues.push(...contentScriptAnalysis.issues);

      // Analyze background scripts
      const backgroundAnalysis = this.analyzeBackgroundScripts(manifest.background || {});
      analysis.riskScore += backgroundAnalysis.riskScore;
      analysis.issues.push(...backgroundAnalysis.issues);

      // Determine risk level
      if (analysis.riskScore >= 70) {
        analysis.riskLevel = 'High';
        analysis.recommendations.push('Remove extension immediately');
        analysis.recommendations.push('Change all passwords');
        analysis.recommendations.push('Review account activity');
      } else if (analysis.riskScore >= 40) {
        analysis.riskLevel = 'Medium';
        analysis.recommendations.push('Review extension permissions');
        analysis.recommendations.push('Monitor network activity');
      } else {
        analysis.riskLevel = 'Low';
        analysis.recommendations.push('Extension appears safe');
      }

      return analysis;
    } catch (error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  async loadExtension(extensionPath) {
    // For MVP, we'll work with manifest.json
    // In production, would extract .crx file
    const manifestPath = path.join(extensionPath, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    return { manifest };
  }

  analyzePermissions(permissions) {
    const issues = [];
    let riskScore = 0;

    // Check for overly broad permissions
    if (permissions.includes('<all_urls>') || permissions.includes('*://*/*')) {
      riskScore += 30;
      issues.push('Requests permission for all URLs - high risk');
    }

    // Check for suspicious permission combinations
    const hasWebRequest = permissions.some(p => 
      p.includes('webRequest') || p.includes('webRequestBlocking')
    );
    const hasTabs = permissions.some(p => p.includes('tabs'));
    const hasCookies = permissions.some(p => p.includes('cookies'));

    if (hasWebRequest && hasTabs && hasCookies) {
      riskScore += 25;
      issues.push('Suspicious permission combination: webRequest + tabs + cookies');
    }

    // Check for proxy permissions
    if (permissions.some(p => p.includes('proxy'))) {
      riskScore += 40;
      issues.push('⚠️ CRITICAL: Extension requests proxy permission - possible traffic rerouting');
    }

    // Check for storage permissions
    if (permissions.some(p => p.includes('storage'))) {
      riskScore += 10;
      issues.push('Extension can store data locally');
    }

    return { riskScore, issues };
  }

  analyzeContentScripts(contentScripts) {
    const issues = [];
    let riskScore = 0;

    contentScripts.forEach(script => {
      if (script.matches && script.matches.includes('<all_urls>')) {
        riskScore += 20;
        issues.push('Content script runs on all URLs');
      }
    });

    return { riskScore, issues };
  }

  analyzeBackgroundScripts(background) {
    const issues = [];
    let riskScore = 0;

    // Background scripts with persistent: true are more risky
    if (background.persistent === true) {
      riskScore += 15;
      issues.push('Persistent background script - can monitor continuously');
    }

    return { riskScore, issues };
  }

  detectPhantomShuttlePatterns(analysis) {
    const phantomShuttleIndicators = [];
    
    // Phantom Shuttle characteristics:
    // 1. Proxy rerouting
    if (analysis.issues.some(i => i.includes('proxy'))) {
      phantomShuttleIndicators.push('Matches Phantom Shuttle pattern: Proxy rerouting');
    }
    
    // 2. All URLs permission
    if (analysis.issues.some(i => i.includes('all URLs'))) {
      phantomShuttleIndicators.push('Matches Phantom Shuttle pattern: All URLs access');
    }
    
    // 3. High risk score
    if (analysis.riskScore >= 70) {
      phantomShuttleIndicators.push('Matches Phantom Shuttle pattern: High risk score');
    }

    return phantomShuttleIndicators;
  }
}

module.exports = ExtensionAnalyzer;

