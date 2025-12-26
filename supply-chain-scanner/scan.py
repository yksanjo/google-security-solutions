#!/usr/bin/env python3

import json
import os
import sys
import requests
from pathlib import Path

class SupplyChainScanner:
    def __init__(self):
        self.vulnerabilities_db = {
            # Example vulnerabilities (in production, would query CVE API)
            'express': ['CVE-2022-24999'],
            'lodash': ['CVE-2021-23337'],
            'axios': ['CVE-2021-3749']
        }
    
    def scan_package_json(self, path):
        """Scan package.json for dependencies"""
        package_json_path = Path(path) / 'package.json'
        
        if not package_json_path.exists():
            return None
        
        with open(package_json_path, 'r') as f:
            data = json.load(f)
        
        dependencies = {}
        dependencies.update(data.get('dependencies', {}))
        dependencies.update(data.get('devDependencies', {}))
        
        return dependencies
    
    def check_vulnerability(self, package, version):
        """Check if package has known vulnerabilities"""
        vulnerabilities = []
        
        # Check local database
        if package.lower() in self.vulnerabilities_db:
            vulnerabilities.extend(self.vulnerabilities_db[package.lower()])
        
        # In production, would query:
        # - NPM Security Advisories
        # - CVE Database
        # - GitHub Security Advisories
        
        return vulnerabilities
    
    def scan_project(self, path):
        """Scan a project for dependency vulnerabilities"""
        print(f'\n🔍 Scanning project: {path}\n')
        
        dependencies = self.scan_package_json(path)
        
        if not dependencies:
            print('❌ No package.json found')
            return None
        
        results = {
            'total': len(dependencies),
            'vulnerable': [],
            'safe': [],
            'outdated': []
        }
        
        print(f'Found {len(dependencies)} dependencies\n')
        print('=' * 60)
        
        for package, version in dependencies.items():
            vulnerabilities = self.check_vulnerability(package, version)
            
            if vulnerabilities:
                results['vulnerable'].append({
                    'package': package,
                    'version': version,
                    'vulnerabilities': vulnerabilities
                })
                print(f'❌ {package}@{version}')
                print(f'   Vulnerabilities: {", ".join(vulnerabilities)}')
            else:
                results['safe'].append({
                    'package': package,
                    'version': version
                })
                print(f'✅ {package}@{version}')
        
        print('\n' + '=' * 60)
        print(f'\nSummary:')
        print(f'  Total: {results["total"]}')
        print(f'  Vulnerable: {len(results["vulnerable"])}')
        print(f'  Safe: {len(results["safe"])}')
        
        if results['vulnerable']:
            print('\n⚠️  Recommendations:')
            print('  1. Update vulnerable packages')
            print('  2. Review CVE details')
            print('  3. Test updates in development')
            print('  4. Monitor for new vulnerabilities')
        
        return results

def main():
    if len(sys.argv) < 2:
        print('Usage: python scan.py <project-path>')
        print('Example: python scan.py ./my-project')
        sys.exit(1)
    
    path = sys.argv[1]
    
    if not os.path.exists(path):
        print(f'❌ Path not found: {path}')
        sys.exit(1)
    
    scanner = SupplyChainScanner()
    results = scanner.scan_project(path)
    
    if results and results['vulnerable']:
        sys.exit(1)

if __name__ == '__main__':
    main()

