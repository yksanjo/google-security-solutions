#!/bin/bash

# GitHub Push Script for Google Security Solutions
# This script helps you push the repository to GitHub

echo "🚀 Google Security Solutions - GitHub Push Script"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Repository name
REPO_NAME="google-security-solutions"

echo ""
echo "📝 Repository Details:"
echo "  Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "y" ]; then
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        echo "✅ Remote updated"
    fi
else
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "✅ Remote added"
fi

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "✅ Branch renamed to 'main'"
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📦 Staging files..."
    git add .
    
    echo "💾 Creating commit..."
    git commit -m "Initial commit: MVP security solutions for Google vulnerabilities

- Chrome Zero-Day Monitor: Real-time monitoring and alerting
- Extension Security Analyzer: Detect malicious Chrome extensions
- AI Promptware Defender: Defend against prompt injection attacks
- Supply Chain Scanner: Scan dependencies for vulnerabilities
- Android Security Scanner: Check Android device security

All solutions address critical vulnerabilities identified in Google's ecosystem (2024-2025)."
    echo "✅ Commit created"
else
    echo "ℹ️  No changes to commit"
fi

echo ""
echo "🌐 Pushing to GitHub..."
echo ""
echo "⚠️  IMPORTANT: Make sure you've created the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo "   Description: MVP security solutions addressing Google ecosystem vulnerabilities"
echo ""
read -p "Press Enter when repository is created, or Ctrl+C to cancel..."

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📸 Next Steps:"
    echo "  1. Take screenshots of each solution"
    echo "  2. Save them to the screenshots/ directory"
    echo "  3. Commit and push: git add screenshots/ && git commit -m 'Add screenshots' && git push"
    echo ""
    echo "📝 Update Repository Settings:"
    echo "  - Add topics: security, vulnerability-scanner, chrome-security, android-security"
    echo "  - Update description"
    echo "  - Enable Issues and Discussions"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "  - Repository doesn't exist on GitHub"
    echo "  - Authentication required (use GitHub CLI or SSH)"
    echo "  - Network issues"
    echo ""
    echo "💡 Try:"
    echo "  - gh auth login (if using GitHub CLI)"
    echo "  - Or set up SSH keys"
fi

