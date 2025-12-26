#!/bin/bash

echo "🚀 Pushing Google Security Solutions to GitHub"
echo "================================================"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

REPO_NAME="google-security-solutions"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📋 Repository Details:"
echo "  Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  URL: $REPO_URL"
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    CURRENT_URL=$(git remote get-url origin)
    echo "⚠️  Remote 'origin' already exists: $CURRENT_URL"
    read -p "Update to new URL? (y/n): " UPDATE
    if [ "$UPDATE" = "y" ]; then
        git remote set-url origin "$REPO_URL"
        echo "✅ Remote updated"
    fi
else
    git remote add origin "$REPO_URL"
    echo "✅ Remote added"
fi

# Rename branch to main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "✅ Branch renamed to 'main'"
fi

echo ""
echo "⚠️  IMPORTANT: Make sure the repository exists on GitHub!"
echo ""
echo "If you haven't created it yet:"
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: $REPO_NAME"
echo "  3. Description: MVP security solutions addressing Google ecosystem vulnerabilities"
echo "  4. Visibility: Public (or Private)"
echo "  5. DO NOT initialize with README/gitignore/license"
echo "  6. Click 'Create repository'"
echo ""
read -p "Press Enter when repository is created, or Ctrl+C to cancel..."

echo ""
echo "🌐 Pushing to GitHub..."
echo ""

# Try to push
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ SUCCESS! Repository pushed to GitHub!"
    echo ""
    echo "🔗 Repository URL: $REPO_URL"
    echo ""
    echo "📸 Next Steps:"
    echo "  1. Take screenshots of each solution"
    echo "  2. Save to screenshots/ directory"
    echo "  3. Run: git add screenshots/ && git commit -m 'Add screenshots' && git push"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo ""
    echo "1. Repository doesn't exist on GitHub"
    echo "   → Create it at: https://github.com/new"
    echo ""
    echo "2. Authentication required"
    echo "   → Install GitHub CLI: brew install gh"
    echo "   → Then run: gh auth login"
    echo "   → Or use Personal Access Token"
    echo ""
    echo "3. Wrong repository name"
    echo "   → Check your GitHub username"
    echo "   → Verify repository name matches"
    echo ""
    echo "💡 Try again after fixing the issue above"
fi

