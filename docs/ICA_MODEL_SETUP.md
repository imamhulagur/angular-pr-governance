# ICA Model Configuration for Bob AI

This guide explains how to configure Bob AI to use IBM ICA models instead of direct Claude API.

## Why Use ICA Models?

✅ **Enterprise Compliance**: Models hosted within IBM infrastructure  
✅ **Cost Control**: Centralized billing and usage tracking  
✅ **Security**: Data stays within IBM network  
✅ **Governance**: Meets enterprise AI governance requirements  

## Configuration Steps

### 1. Get ICA Model Access

Contact your IBM ICA administrator to get:
- ICA model endpoint URL
- API key or authentication token
- Available model names

### 2. Configure GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

```bash
# Enable ICA models
USE_ICA_MODELS=true

# ICA endpoint (example format - verify with your ICA admin)
ICA_MODEL_ENDPOINT=https://your-ica-instance.ibm.com/v1/chat/completions

# Model name (check available models with ICA admin)
ICA_MODEL_NAME=claude-3-5-sonnet

# ICA API key
ICA_API_KEY=your_ica_api_key_here

# Keep ngnetic-mcp credentials
NGNETIC_MCP_URL=https://servicesessentials.ibm.com/...
NGNETIC_MCP_BEARER_TOKEN=your_token
NGNETIC_MCP_API_KEY=your_key
```

### 3. Verify ICA Endpoint Format

ICA may use different API formats. Common formats:

#### OpenAI-Compatible Format
```bash
ICA_MODEL_ENDPOINT=https://ica.ibm.com/v1/chat/completions
```

#### Anthropic-Compatible Format
```bash
ICA_MODEL_ENDPOINT=https://ica.ibm.com/v1/messages
```

#### Custom IBM Format
```bash
ICA_MODEL_ENDPOINT=https://ica.ibm.com/api/v1/generate
```

**Ask your ICA administrator** which format to use.

### 4. Test Configuration

Create a test PR to verify Bob can connect to ICA:

```bash
git checkout -b test-ica-bob
# Make a small change
git commit -am "Test ICA Bob integration"
git push origin test-ica-bob
# Create PR and check workflow logs
```

## Troubleshooting

### Issue: "ICA_MODEL_ENDPOINT not configured"

**Solution**: Ensure `USE_ICA_MODELS=true` and `ICA_MODEL_ENDPOINT` is set in GitHub secrets.

### Issue: "Authentication failed"

**Solution**: 
- Verify `ICA_API_KEY` is correct
- Check if token has expired
- Confirm you have access to the ICA model endpoint

### Issue: "Model not found"

**Solution**:
- Verify `ICA_MODEL_NAME` matches available models
- Check with ICA admin for correct model names
- Try: `claude-3-5-sonnet`, `gpt-4`, or other available models

### Issue: "MCP tools not working"

**Solution**:
- Ensure ICA endpoint supports MCP protocol
- Verify ngnetic-mcp credentials are correct
- Check if ICA can reach ngnetic-mcp endpoint

## Fallback to Direct Claude API

If ICA is not available, Bob can fall back to direct Claude API:

```bash
# In GitHub Secrets, set:
USE_ICA_MODELS=false
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## API Request Format

Bob sends requests in this format (adjust based on your ICA setup):

```json
{
  "model": "claude-3-5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "You are Bob, an Angular expert..."
    },
    {
      "role": "user", 
      "content": "Review this PR..."
    }
  ],
  "max_tokens": 8000,
  "mcp_config": {
    "mcpServers": {
      "ngnetic-mcp": {
        "url": "...",
        "headers": {...}
      }
    }
  }
}
```

## Getting ICA Details

To get your ICA configuration details:

1. **Contact ICA Admin**: Email your IBM ICA administrator
2. **Check ICA Console**: Log into your ICA dashboard
3. **Review Documentation**: Check internal IBM ICA docs
4. **Ask in Slack**: Post in your team's ICA support channel

## Common ICA Endpoints

Different IBM regions may have different endpoints:

```bash
# US Region
ICA_MODEL_ENDPOINT=https://us.ica.ibm.com/v1/chat/completions

# EU Region  
ICA_MODEL_ENDPOINT=https://eu.ica.ibm.com/v1/chat/completions

# Custom Instance
ICA_MODEL_ENDPOINT=https://your-instance.ica.ibm.com/v1/chat/completions
```

## Next Steps

1. ✅ Get ICA access from your administrator
2. ✅ Configure GitHub secrets with ICA details
3. ✅ Test with a sample PR
4. ✅ Monitor costs and usage in ICA console
5. ✅ Update team documentation with your ICA setup

## Support

- **ICA Issues**: Contact IBM ICA support team
- **Bob Issues**: Check workflow logs in GitHub Actions
- **MCP Issues**: Verify ngnetic-mcp connection in console

---

**Note**: This is a template. Update with your actual ICA endpoint details once you receive them from your IBM administrator.