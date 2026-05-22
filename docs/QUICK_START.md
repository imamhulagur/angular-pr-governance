# Quick Start Guide - Bob AI PR Governance

Follow these steps to get Bob AI reviewing your PRs using ICA models!

## Step 1: Add GitHub Secrets

Go to your repository: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

### Required Secrets (ICA Models - Recommended)

```bash
# Ngnetic MCP Configuration (includes GitHub connector)
NGNETIC_MCP_URL=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/YOUR_SERVER_ID/mcp
NGNETIC_MCP_BEARER_TOKEN=your_bearer_token_here
NGNETIC_MCP_API_KEY=your_api_key_here

# ICA Model Configuration (Bob will use IBM-hosted models)
ICA_MODEL_ENDPOINT=https://your-ica-endpoint/v1/chat/completions
ICA_MODEL_NAME=claude-3-5-sonnet
```

**Note**: `ICA_API_KEY` will automatically use `NGNETIC_MCP_API_KEY` if not separately configured.

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
   - ✅ ICA_MODEL_ENDPOINT
   - ✅ ICA_MODEL_NAME (optional, defaults to claude-3-5-sonnet)

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

### "ICA_MODEL_ENDPOINT not configured" or "ANTHROPIC_API_KEY not set"
- **Primary**: Get ICA_MODEL_ENDPOINT from your IBM ICA administrator
- **Fallback**: Add ANTHROPIC_API_KEY for testing (starts with `sk-ant-`)
- Bob prioritizes ICA models for enterprise governance

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
- **ngnetic-mcp**: Included in IBM ICA subscription
- **GitHub Actions**: Free for public repos, included in most plans
- **Fallback Claude API** (if used): ~$0.05-$0.20 per PR review

## Next Steps

After successful test:
1. ✅ Review Bob's feedback on the test PR
2. ✅ Adjust review criteria if needed (edit `.github/workflows/bob-review.yml`)
3. ✅ Enable for all PRs to main/develop branches
4. ✅ Train team on Bob's feedback format
5. ✅ Monitor costs and usage

## Fallback: Use Direct Claude API (Testing Only)

If ICA is not yet configured, you can temporarily use direct Claude API for testing:

1. Get API key from https://console.anthropic.com/
2. Add this secret:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```
3. Bob will automatically fall back to Claude API if ICA is not configured
4. **Important**: Switch to ICA models for production use

See `docs/ICA_MODEL_SETUP.md` for full ICA configuration details.

## Support

- **Workflow issues**: Check GitHub Actions logs
- **API issues**: Check Anthropic console
- **MCP issues**: Check ngnetic-mcp console
- **Questions**: Open an issue in this repository

---

**Ready to start?** Add the 4 secrets and create a PR! 🚀