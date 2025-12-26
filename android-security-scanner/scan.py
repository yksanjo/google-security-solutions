#!/usr/bin/env python3

import subprocess
import sys
import json
from datetime import datetime

class AndroidSecurityScanner:
    def __init__(self):
        # Known Android vulnerabilities from analysis
        self.known_vulnerabilities = {
            '13': ['CVE-2025-48633', 'CVE-2025-48572'],
            '14': ['CVE-2025-48633', 'CVE-2025-48572'],
            '15': ['CVE-2025-48633', 'CVE-2025-48572'],
            '16': ['CVE-2025-48633', 'CVE-2025-48572'],
            '12': ['CVE-2024-43093', 'CVE-2024-50302']
        }
    
    def get_android_version(self):
        """Get Android version via ADB"""
        try:
            result = subprocess.run(
                ['adb', 'shell', 'getprop', 'ro.build.version.release'],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
        return None
    
    def get_security_patch(self):
        """Get security patch level via ADB"""
        try:
            result = subprocess.run(
                ['adb', 'shell', 'getprop', 'ro.build.version.security_patch'],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
        return None
    
    def check_vulnerabilities(self, version):
        """Check for known vulnerabilities"""
        major_version = version.split('.')[0] if version else None
        
        vulnerabilities = []
        if major_version in self.known_vulnerabilities:
            vulnerabilities = self.known_vulnerabilities[major_version]
        
        return vulnerabilities
    
    def scan_device(self):
        """Scan connected Android device"""
        print('\n🔍 Scanning Android Device\n')
        print('=' * 60)
        
        version = self.get_android_version()
        security_patch = self.get_security_patch()
        
        if not version:
            print('❌ No Android device connected via ADB')
            print('   Connect device and enable USB debugging')
            return None
        
        print(f'Android Version: {version}')
        print(f'Security Patch: {security_patch or "Unknown"}')
        
        vulnerabilities = self.check_vulnerabilities(version)
        
        print('\n' + '=' * 60)
        
        if vulnerabilities:
            print(f'\n⚠️  VULNERABILITIES DETECTED: {len(vulnerabilities)}')
            for cve in vulnerabilities:
                print(f'  - {cve}')
            
            print('\n📋 Recommendations:')
            print('  1. Update Android to latest version')
            print('  2. Install latest security patches')
            print('  3. Enable automatic updates')
            print('  4. Review security settings')
        else:
            print('\n✅ No known vulnerabilities detected for this version')
            print('   Keep device updated for security')
        
        return {
            'version': version,
            'security_patch': security_patch,
            'vulnerabilities': vulnerabilities,
            'timestamp': datetime.now().isoformat()
        }

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Android Security Scanner')
    parser.add_argument('--device', action='store_true', help='Scan connected device')
    parser.add_argument('--version', help='Check specific Android version')
    parser.add_argument('--report', action='store_true', help='Generate JSON report')
    
    args = parser.parse_args()
    
    scanner = AndroidSecurityScanner()
    
    if args.version:
        vulnerabilities = scanner.check_vulnerabilities(args.version)
        print(f'\nAndroid {args.version} vulnerabilities:')
        if vulnerabilities:
            for cve in vulnerabilities:
                print(f'  - {cve}')
        else:
            print('  None known')
    elif args.device:
        result = scanner.scan_device()
        if args.report and result:
            with open('android-security-report.json', 'w') as f:
                json.dump(result, f, indent=2)
            print('\n📄 Report saved to android-security-report.json')
    else:
        parser.print_help()

if __name__ == '__main__':
    main()

