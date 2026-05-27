# Setup GitHub Secrets for Bob AI

## Quick Setup (5 minutes)

### Step 1: Go to Secrets Page
Open this URL in your browser:
```
https://github.com/imamhulagur/angular-pr-governance/settings/secrets/actions
```

### Step 2: Add These 4 Secrets

Click "New repository secret" for each:

#### 1. NGNETIC_MCP_URL
- **Name**: `NGNETIC_MCP_URL`
- **Value**: Get from your Context Studio
  - Go to: https://contextstudio.servicesessentials.ibm.com/contextinfo/ctx_2028fc82ac9c/manager
  - Click "Sources & Data" tab
  - Look for "Personal Github" connector
  - Copy the MCP endpoint URL
  - Should look like: `https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/ctx_2028fc82ac9c/mcp`

#### 2. NGNETIC_MCP_BEARER_TOKEN
- **Name**: `NGNETIC_MCP_BEARER_TOKEN`
- **Value**: Your bearer token for ngnetic-mcp authentication
  - Contact your IBM ICA administrator if you don't have this
  - Or check your ICA credentials

#### 3. NGNETIC_MCP_API_KEY
- **Name**: `NGNETIC_MCP_API_KEY`
- **Value**: Your API key for ngnetic-mcp
  - Contact your IBM ICA administrator if you don't have this
  - Or check your ICA credentials

#### 4. GROQ_API_KEY
- **Name**: `GROQ_API_KEY`
- **Value**: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - (Get your actual key from console.groq.com)

### Step 3: Verify Secrets Added

After adding all 4 secrets, you should see:
- ✅ NGNETIC_MCP_URL
- ✅ NGNETIC_MCP_BEARER_TOKEN
- ✅ NGNETIC_MCP_API_KEY
- ✅ GROQ_API_KEY

### Step 4: Re-run Workflow

1. Go to your PR: https://github.com/imamhulagur/angular-pr-governance/pull/1
2. Click "Checks" tab
3. Click "Re-run all jobs"
4. Watch Bob work!

## What Bob Will Do

Once secrets are added:
1. ✅ Connect to your ngnetic-mcp
2. ✅ Use GitHub connector to fetch PR files
3. ✅ Analyze code with Groq AI
4. ✅ Post detailed review comments with fixes
5. ✅ Fully autonomous!

## Troubleshooting

### "Missing ngnetic-mcp credentials"
- Make sure all 3 ngnetic-mcp secrets are added
- Check spelling is exact (case-sensitive)
- Verify no extra spaces in values

### "GROQ_API_KEY not configured"
- Add the Groq API key secret
- Make sure it starts with `gsk_`

### "Connection failed"
- Verify NGNETIC_MCP_URL is correct
- Check bearer token and API key are valid
- Test connection in Context Studio first

## Need Help?

Contact your IBM ICA administrator for:
- NGNETIC_MCP_BEARER_TOKEN
- NGNETIC_MCP_API_KEY
- NGNETIC_MCP_URL verification

---

**Quick Link**: https://github.com/imamhulagur/angular-pr-governance/settings/secrets/actions