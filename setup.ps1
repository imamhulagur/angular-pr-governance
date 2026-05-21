# Angular PR Governance Setup Script (PowerShell)
# This script helps you set up the project securely on Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Angular PR Governance - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Setup cancelled. Keeping existing .env file." -ForegroundColor Red
        exit 1
    }
}

# Copy .env.example to .env
Write-Host "📋 Creating .env file from template..." -ForegroundColor Green
Copy-Item ".env.example" ".env"
Write-Host "✅ .env file created" -ForegroundColor Green
Write-Host ""

# Check if .bob/mcp.json exists
if (Test-Path ".bob/mcp.json") {
    Write-Host "⚠️  .bob/mcp.json file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Setup cancelled. Keeping existing .bob/mcp.json file." -ForegroundColor Red
        exit 1
    }
}

# Copy .bob/mcp.json.example to .bob/mcp.json
Write-Host "📋 Creating .bob/mcp.json file from template..." -ForegroundColor Green
Copy-Item ".bob/mcp.json.example" ".bob/mcp.json"
Write-Host "✅ .bob/mcp.json file created" -ForegroundColor Green
Write-Host ""

# Prompt for credentials
Write-Host "🔐 Please provide your credentials:" -ForegroundColor Cyan
Write-Host ""

# GitHub PAT
$GITHUB_PAT = Read-Host "Enter your GitHub Personal Access Token"
if ([string]::IsNullOrWhiteSpace($GITHUB_PAT)) {
    Write-Host "❌ GitHub PAT is required!" -ForegroundColor Red
    exit 1
}

# GitHub Host
$GITHUB_HOST = Read-Host "Enter your GitHub Host (default: https://github.ibm.com)"
if ([string]::IsNullOrWhiteSpace($GITHUB_HOST)) {
    $GITHUB_HOST = "https://github.ibm.com"
}

# Ngnetic MCP URL
$NGNETIC_URL = Read-Host "Enter your Ngnetic MCP URL"
if ([string]::IsNullOrWhiteSpace($NGNETIC_URL)) {
    Write-Host "❌ Ngnetic MCP URL is required!" -ForegroundColor Red
    exit 1
}

# Ngnetic Bearer Token
$NGNETIC_TOKEN = Read-Host "Enter your Ngnetic MCP Bearer Token"
if ([string]::IsNullOrWhiteSpace($NGNETIC_TOKEN)) {
    Write-Host "❌ Ngnetic Bearer Token is required!" -ForegroundColor Red
    exit 1
}

# Ngnetic API Key
$NGNETIC_KEY = Read-Host "Enter your Ngnetic MCP API Key"
if ([string]::IsNullOrWhiteSpace($NGNETIC_KEY)) {
    Write-Host "❌ Ngnetic API Key is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Updating configuration files..." -ForegroundColor Green

# Update .env file
$envContent = Get-Content ".env" -Raw
$envContent = $envContent -replace "GITHUB_PERSONAL_ACCESS_TOKEN=.*", "GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT"
$envContent = $envContent -replace "GITHUB_HOST=.*", "GITHUB_HOST=$GITHUB_HOST"
$envContent = $envContent -replace "NGNETIC_MCP_URL=.*", "NGNETIC_MCP_URL=$NGNETIC_URL"
$envContent = $envContent -replace "NGNETIC_MCP_BEARER_TOKEN=.*", "NGNETIC_MCP_BEARER_TOKEN=$NGNETIC_TOKEN"
$envContent = $envContent -replace "NGNETIC_MCP_API_KEY=.*", "NGNETIC_MCP_API_KEY=$NGNETIC_KEY"
Set-Content ".env" $envContent

# Update .bob/mcp.json file
$mcpContent = Get-Content ".bob/mcp.json" -Raw
$mcpContent = $mcpContent -replace '\$\{GITHUB_PERSONAL_ACCESS_TOKEN\}', $GITHUB_PAT
$mcpContent = $mcpContent -replace '\$\{GITHUB_HOST\}', $GITHUB_HOST
$mcpContent = $mcpContent -replace '\$\{NGNETIC_MCP_URL\}', $NGNETIC_URL
$mcpContent = $mcpContent -replace '\$\{NGNETIC_MCP_BEARER_TOKEN\}', $NGNETIC_TOKEN
$mcpContent = $mcpContent -replace '\$\{NGNETIC_MCP_API_KEY\}', $NGNETIC_KEY
Set-Content ".bob/mcp.json" $mcpContent

Write-Host "✅ Configuration files updated" -ForegroundColor Green
Write-Host ""

# Verify .gitignore
Write-Host "🔍 Verifying .gitignore..." -ForegroundColor Cyan
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "\.env" -and $gitignoreContent -match "\.bob/mcp\.json") {
    Write-Host "✅ .gitignore is properly configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: .gitignore may not be properly configured!" -ForegroundColor Yellow
    Write-Host "   Please ensure .env and .bob/mcp.json are in .gitignore" -ForegroundColor Yellow
}
Write-Host ""

# Check if files are tracked by git
Write-Host "🔍 Checking Git status..." -ForegroundColor Cyan
try {
    $envTracked = git ls-files --error-unmatch .env 2>$null
    if ($envTracked) {
        Write-Host "⚠️  WARNING: .env is tracked by Git!" -ForegroundColor Yellow
        Write-Host "   Run: git rm --cached .env" -ForegroundColor Yellow
    }
} catch {}

try {
    $mcpTracked = git ls-files --error-unmatch .bob/mcp.json 2>$null
    if ($mcpTracked) {
        Write-Host "⚠️  WARNING: .bob/mcp.json is tracked by Git!" -ForegroundColor Yellow
        Write-Host "   Run: git rm --cached .bob/mcp.json" -ForegroundColor Yellow
    }
} catch {}
Write-Host ""

# Final instructions
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review your .env file: notepad .env" -ForegroundColor White
Write-Host "2. Review your .bob/mcp.json file: notepad .bob/mcp.json" -ForegroundColor White
Write-Host "3. NEVER commit these files to Git!" -ForegroundColor Yellow
Write-Host "4. Install dependencies: npm install" -ForegroundColor White
Write-Host "5. Test Bob MCP connection" -ForegroundColor White
Write-Host ""
Write-Host "🔒 Security Reminder:" -ForegroundColor Red
Write-Host "- .env and .bob/mcp.json contain sensitive credentials" -ForegroundColor White
Write-Host "- These files are in .gitignore and should NEVER be committed" -ForegroundColor White
Write-Host "- Rotate your credentials regularly" -ForegroundColor White
Write-Host "- See SECURITY.md for more information" -ForegroundColor White
Write-Host ""
Write-Host "🎉 You're ready to use the Angular PR Governance system!" -ForegroundColor Green

# Made with Bob
