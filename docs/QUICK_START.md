# Quick Start Guide - Bob AI PR Governance

Follow these steps to get Bob AI reviewing your PRs!

## Step 1: Add GitHub Secrets

Go to your repository: **Settings → Secrets and variables → Actions → New repository secret**

### Option A: ICA Models (Recommended for Enterprise)

```bash
# Ngnetic MCP Configuration (includes GitHub connector)
NGNETIC_MCP_URL=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/YOUR_SERVER_ID/mcp
NGNETIC_MCP_BEARER_TOKEN=your_bearer_token_here
NGNETIC_MCP_API_KEY=your_api_key_here

# ICA Model Configuration (Bob will use IBM-hosted models)
ICA_MODEL_ENDPOINT=https://your-ica-endpoint/v1/chat/completions
ICA_MODEL_NAME=llama-3.3-70b-versatile
```

### Option B: Groq API (Fast & Free Fallback)

If ICA is not yet configured, use Groq for testing:

```bash
# Ngnetic MCP Configuration (required)
NGNETIC_MCP_URL=https://servicesessentials.ibm.com/...
NGNETIC_MCP_BEARER_TOKEN=your_token
NGNETIC_MCP_API_KEY=your_key

# Groq API (get free key from https://console.groq.com)
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL_NAME=llama-3.3-70b-versatile
```

**Groq Benefits:**
- ⚡ Ultra-fast inference (10x faster than others)
- 💰 Free tier available
- 🚀 Great for testing before ICA setup

### How to Get Each Secret

#### 1. NGNETIC_MCP_URL
1. Log into https://contextstudio.servicesessentials.ibm.com/
2. Go to your "Angular PR Governance Context"
3. Click "Sources & Data" tab
4. Copy the MCP endpoint URL from your GitHub connector

#### 2. NGNETIC_MCP_BEARER_TOKEN & NGNETIC_MCP_API_KEY
- Get from your ngnetic-mcp administrator
- Or check your ICA credentials
- These authenticate Bob to access your GitHub connector

#### 3. ICA_MODEL_ENDPOINT
- Get from your IBM ICA administrator
- This is where Bob will access AI models
- Example: `https://ica.ibm.com/v1/chat/completions`
- Contact your ICA team if you don't have this

#### 4. ICA_MODEL_NAME
- Default: `claude-3-5-sonnet`
- Check with ICA admin for available models
- Could be: `gpt-4`, `claude-3-opus`, etc.

## Step 2: Verify Secrets

After adding secrets, verify they're set:

1. Go to **Settings → Secrets and variables → Actions**
2. You should see:
   - ✅ NGNETIC_MCP_URL
   - ✅ NGNETIC_MCP_BEARER_TOKEN
   - ✅ NGNETIC_MCP_API_KEY
   - ✅ ICA_MODEL_ENDPOINT (for ICA) OR GROQ_API_KEY (for Groq)

## Step 3: Create a Test PR

```bash
# The bad-code branch already has flawed components
# Just create a PR from it:

# Option 1: Via GitHub UI
1. Go to your repository on GitHub
2. Click "Pull requests" → "New pull request"
3. Set base: main, compare: bad-code
4. Click "Create pull request"
5. Add title: "Test Bob AI Review"
6. Click "Create pull request"

# Option 2: Via GitHub CLI
gh pr create --base main --head bad-code --title "Test Bob AI Review" --body "Testing Bob AI autonomous governance review"
```

## Step 4: Watch Bob in Action

1. Go to the PR you just created
2. Click on "Actions" tab (or "Checks" in the PR)
3. Watch the "🤖 Bob AI PR Governance Review" workflow run
4. Wait for Bob to complete (usually 2-5 minutes)
5. Check the PR for Bob's comments!

## What Bob Will Find

Bob will analyze the flawed components and post comments about:

### 🔴 Critical Issues
- RxJS memory leaks (unsubscribed observables)
- Direct `fetch()` usage instead of HttpClient
- Missing ARIA labels and accessibility attributes
- Security vulnerabilities

### 🟡 Warnings
- Code quality issues
- Performance concerns
- Best practice violations

### 🟢 Suggestions
- Code improvements
- Optimization opportunities

## Expected Output

You should see:
1. ✅ Workflow completes successfully
2. 💬 Bob posts inline comments on problematic code
3. 📊 Bob posts a summary comment with metrics
4. 🔴 Critical issues are highlighted

## Troubleshooting

### "Neither ICA_MODEL_ENDPOINT nor GROQ_API_KEY configured"
- **Primary**: Get ICA_MODEL_ENDPOINT from your IBM ICA administrator
- **Quick Start**: Get free GROQ_API_KEY from https://console.groq.com
- Bob prioritizes ICA models, falls back to Groq if ICA not available

### "MCP configuration not found"
- Check NGNETIC_MCP_URL is correct
- Verify bearer token and API key are valid
- Test connection in ngnetic-mcp console

### "Workflow fails immediately"
- Check GitHub Actions logs for specific error
- Verify all 4 secrets are added
- Ensure secrets have no extra spaces

### "Bob doesn't post comments"
- Check if ngnetic-mcp GitHub connector is active
- Verify connector has write permissions
- Review workflow logs for API errors

## Cost Estimate

- **ICA Models**: Centralized IBM billing, check with your ICA account
- **Groq API**: Free tier available (14,400 requests/day), then $0.05-$0.10 per 1M tokens
- **ngnetic-mcp**: Included in IBM ICA subscription
- **GitHub Actions**: Free for public repos, included in most plans

## Next Steps

After successful test:
1. ✅ Review Bob's feedback on the test PR
2. ✅ Adjust review criteria if needed (edit `.github/workflows/bob-review.yml`)
3. ✅ Enable for all PRs to main/develop branches
4. ✅ Train team on Bob's feedback format
5. ✅ Monitor costs and usage

## How to Get Groq API Key (Free!)

1. Go to https://console.groq.com
2. Sign up with Google/GitHub
3. Go to API Keys section
4. Create new key
5. Copy the key (starts with `gsk_`)
6. Add to GitHub Secrets as `GROQ_API_KEY`

**Groq is perfect for:**
- ⚡ Testing Bob before ICA setup
- 🚀 Fast PR reviews (10x faster inference)
- 💰 Free tier: 14,400 requests/day
- 🎯 Production use (if ICA not available)

See `docs/ICA_MODEL_SETUP.md` for full ICA configuration details.

## Support

- **Workflow issues**: Check GitHub Actions logs
- **API issues**: Check Anthropic console
- **MCP issues**: Check ngnetic-mcp console
- **Questions**: Open an issue in this repository

---

**Ready to start?** Add the 4 secrets and create a PR! 🚀