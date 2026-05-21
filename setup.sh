#!/bin/bash

# Angular PR Governance Setup Script
# This script helps you set up the project securely

set -e

echo "🚀 Angular PR Governance - Setup Script"
echo "========================================"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Keeping existing .env file."
        exit 1
    fi
fi

# Copy .env.example to .env
echo "📋 Creating .env file from template..."
cp .env.example .env
echo "✅ .env file created"
echo ""

# Check if .bob/mcp.json exists
if [ -f ".bob/mcp.json" ]; then
    echo "⚠️  .bob/mcp.json file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Keeping existing .bob/mcp.json file."
        exit 1
    fi
fi

# Copy .bob/mcp.json.example to .bob/mcp.json
echo "📋 Creating .bob/mcp.json file from template..."
cp .bob/mcp.json.example .bob/mcp.json
echo "✅ .bob/mcp.json file created"
echo ""

# Prompt for credentials
echo "🔐 Please provide your credentials:"
echo ""

# GitHub PAT
read -p "Enter your GitHub Personal Access Token: " GITHUB_PAT
if [ -z "$GITHUB_PAT" ]; then
    echo "❌ GitHub PAT is required!"
    exit 1
fi

# GitHub Host
read -p "Enter your GitHub Host (default: https://github.ibm.com): " GITHUB_HOST
GITHUB_HOST=${GITHUB_HOST:-https://github.ibm.com}

# Ngnetic MCP URL
read -p "Enter your Ngnetic MCP URL: " NGNETIC_URL
if [ -z "$NGNETIC_URL" ]; then
    echo "❌ Ngnetic MCP URL is required!"
    exit 1
fi

# Ngnetic Bearer Token
read -p "Enter your Ngnetic MCP Bearer Token: " NGNETIC_TOKEN
if [ -z "$NGNETIC_TOKEN" ]; then
    echo "❌ Ngnetic Bearer Token is required!"
    exit 1
fi

# Ngnetic API Key
read -p "Enter your Ngnetic MCP API Key: " NGNETIC_KEY
if [ -z "$NGNETIC_KEY" ]; then
    echo "❌ Ngnetic API Key is required!"
    exit 1
fi

echo ""
echo "📝 Updating configuration files..."

# Update .env file
sed -i "s|GITHUB_PERSONAL_ACCESS_TOKEN=.*|GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT|" .env
sed -i "s|GITHUB_HOST=.*|GITHUB_HOST=$GITHUB_HOST|" .env
sed -i "s|NGNETIC_MCP_URL=.*|NGNETIC_MCP_URL=$NGNETIC_URL|" .env
sed -i "s|NGNETIC_MCP_BEARER_TOKEN=.*|NGNETIC_MCP_BEARER_TOKEN=$NGNETIC_TOKEN|" .env
sed -i "s|NGNETIC_MCP_API_KEY=.*|NGNETIC_MCP_API_KEY=$NGNETIC_KEY|" .env

# Update .bob/mcp.json file
sed -i "s|\${GITHUB_PERSONAL_ACCESS_TOKEN}|$GITHUB_PAT|g" .bob/mcp.json
sed -i "s|\${GITHUB_HOST}|$GITHUB_HOST|g" .bob/mcp.json
sed -i "s|\${NGNETIC_MCP_URL}|$NGNETIC_URL|g" .bob/mcp.json
sed -i "s|\${NGNETIC_MCP_BEARER_TOKEN}|$NGNETIC_TOKEN|g" .bob/mcp.json
sed -i "s|\${NGNETIC_MCP_API_KEY}|$NGNETIC_KEY|g" .bob/mcp.json

echo "✅ Configuration files updated"
echo ""

# Verify .gitignore
echo "🔍 Verifying .gitignore..."
if grep -q ".env" .gitignore && grep -q ".bob/mcp.json" .gitignore; then
    echo "✅ .gitignore is properly configured"
else
    echo "⚠️  Warning: .gitignore may not be properly configured!"
    echo "   Please ensure .env and .bob/mcp.json are in .gitignore"
fi
echo ""

# Check if files are tracked by git
echo "🔍 Checking Git status..."
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "⚠️  WARNING: .env is tracked by Git!"
    echo "   Run: git rm --cached .env"
fi
if git ls-files --error-unmatch .bob/mcp.json 2>/dev/null; then
    echo "⚠️  WARNING: .bob/mcp.json is tracked by Git!"
    echo "   Run: git rm --cached .bob/mcp.json"
fi
echo ""

# Final instructions
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review your .env file: nano .env"
echo "2. Review your .bob/mcp.json file: nano .bob/mcp.json"
echo "3. NEVER commit these files to Git!"
echo "4. Install dependencies: npm install"
echo "5. Test Bob MCP connection"
echo ""
echo "🔒 Security Reminder:"
echo "- .env and .bob/mcp.json contain sensitive credentials"
echo "- These files are in .gitignore and should NEVER be committed"
echo "- Rotate your credentials regularly"
echo "- See SECURITY.md for more information"
echo ""
echo "🎉 You're ready to use the Angular PR Governance system!"

# Made with Bob
