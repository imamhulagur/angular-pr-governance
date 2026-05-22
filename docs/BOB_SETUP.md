# Bob AI PR Governance Setup Guide

This guide explains how to set up Bob AI for autonomous PR governance reviews using Claude API with ngnetic-mcp.

## Prerequisites

1. **Anthropic API Key**: Get your Claude API key from [Anthropic Console](https://console.anthropic.com/)
2. **Ngnetic MCP Access**: Access to IBM ngnetic-mcp with GitHub connector configured
3. **GitHub Repository**: Repository with GitHub Actions enabled

## Architecture

```
GitHub PR → GitHub Actions → Bob AI (Claude + MCP) → ngnetic-mcp (GitHub Connector) → Post PR Comments
```

Bob AI uses:
- **Claude API**: For intelligent code analysis and review generation
- **ngnetic-mcp**: For accessing GitHub PR data and posting comments via ICA GitHub connector
- **MCP Protocol**: For seamless integration between Claude and enterprise tools

## Setup Steps

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx              # Your Claude API key
NGNETIC_MCP_URL=https://...                 # Your ngnetic-mcp endpoint URL
NGNETIC_MCP_BEARER_TOKEN=xxxxx              # Bearer token for ngnetic-mcp
NGNETIC_MCP_API_KEY=xxxxx                   # API key for ngnetic-mcp
```

### 2. Verify ngnetic-mcp GitHub Connector

Ensure your ngnetic-mcp instance has the ICA GitHub connector configured:

1. Log into ngnetic-mcp console
2. Navigate to "Sources & Data" → "Data Sources"
3. Verify "Personal Github" or similar connector is in "ready" status
4. Test the connection

### 3. Enable GitHub Actions

The workflow `.github/workflows/bob-review.yml` will automatically trigger on:
- Pull requests to `main`, `develop`, or `release/**` branches
- PR events: opened, synchronize, reopened

### 4. Test the Setup

1. Create a test branch with intentionally flawed code:
   ```bash
   git checkout -b test-bob-review
   # Make some changes with known issues
   git push origin test-bob-review
   ```

2. Create a PR from `test-bob-review` to `main`

3. Watch the GitHub Actions workflow run

4. Bob AI will:
   - Analyze the PR using Claude
   - Connect to ngnetic-mcp to access PR details
   - Post inline comments on specific issues
   - Create a comprehensive review summary

## How Bob AI Works

### 1. Workflow Trigger
When a PR is created or updated, GitHub Actions starts the workflow.

### 2. Environment Setup
- Installs Python and dependencies
- Sets up MCP configuration with ngnetic-mcp credentials
- Prepares PR context

### 3. Bob AI Review Execution
```python
# Bob uses Claude API with MCP tools
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    tools=[{
        "type": "mcp",
        "mcp_servers": {
            "ngnetic-mcp": {
                "url": NGNETIC_MCP_URL,
                "headers": {...}
            }
        }
    }],
    messages=[{
        "role": "user",
        "content": "Review this PR and post comments..."
    }]
)
```

### 4. Review Categories

Bob checks for:

#### 🔴 Critical Issues (Block Merge)
- RxJS memory leaks (unsubscribed observables)
- Direct `fetch()` usage instead of HttpClient
- Missing accessibility attributes (ARIA, alt text)
- Security vulnerabilities

#### 🟡 Warnings
- Code quality issues
- Performance concerns
- Best practice violations

#### 🟢 Suggestions
- Code improvements
- Optimization opportunities
- Style recommendations

### 5. PR Comments

Bob posts comments directly to GitHub via ngnetic-mcp:
- **Inline comments**: On specific lines with issues
- **Summary comment**: Overall review with metrics
- **Review decision**: Approve/Request Changes/Comment

## Example Review Output

```markdown
## 🤖 Bob AI Governance Review Summary

### Review Status: Completed

- 🔴 Critical Issues: 3
- 🟡 Warnings: 5
- 🟢 Suggestions: 8

### Critical Violations (Must Fix)

1. **RxJS Memory Leak** - `user-profile.component.ts:25`
   - Unsubscribed observable detected
   - Fix: Add `takeUntil(destroy$)` or use async pipe

2. **HTTP Usage** - `data-table.component.ts:42`
   - Direct fetch() usage instead of HttpClient
   - Fix: Inject HttpClient and use it for API calls

3. **Accessibility** - `modal.component.ts:15`
   - Missing ARIA labels on interactive elements
   - Fix: Add aria-label="Close modal" to button

### Recommendation
❌ **Request Changes** - Critical issues must be resolved before merge
```

## Troubleshooting

### Issue: "MCP configuration not found"
**Solution**: Ensure GitHub secrets are properly configured and accessible in the workflow.

### Issue: "Anthropic API error"
**Solution**: 
- Verify your API key is valid
- Check API rate limits
- Ensure sufficient credits in your Anthropic account

### Issue: "ngnetic-mcp connection failed"
**Solution**:
- Verify ngnetic-mcp URL is correct
- Check bearer token and API key are valid
- Ensure GitHub connector is in "ready" status
- Test connection from ngnetic-mcp console

### Issue: "Bob doesn't post comments"
**Solution**:
- Check GitHub Actions logs for errors
- Verify ngnetic-mcp has permissions to post to your repository
- Ensure the GitHub connector is properly authenticated

## Local Testing

You can test Bob AI locally:

```bash
# Set environment variables
export ANTHROPIC_API_KEY=your_key
export NGNETIC_MCP_URL=your_url
export NGNETIC_MCP_BEARER_TOKEN=your_token
export NGNETIC_MCP_API_KEY=your_api_key

# Create test PR context
cat > pr-context.json << EOF
{
  "pr_number": 1,
  "pr_title": "Test PR",
  "pr_author": "testuser",
  "repository": "owner/repo"
}
EOF

# Run Bob review
python3 .github/scripts/bob-review.py
```

## Cost Considerations

- **Claude API**: Charged per token (input + output)
- **Typical PR review**: ~5,000-15,000 tokens
- **Estimated cost**: $0.05-$0.20 per review
- **ngnetic-mcp**: Check with your IBM account for pricing

## Best Practices

1. **Start with test PRs**: Test Bob on non-critical PRs first
2. **Monitor costs**: Track Claude API usage in Anthropic console
3. **Customize prompts**: Adjust review criteria in `bob-review-prompt.md`
4. **Set up notifications**: Configure alerts for workflow failures
5. **Regular updates**: Keep dependencies and Claude model version updated

## Support

For issues or questions:
- GitHub Actions logs: Check workflow run details
- ngnetic-mcp: Contact IBM support
- Claude API: Check Anthropic documentation
- This project: Open an issue in the repository

## Next Steps

1. ✅ Configure all GitHub secrets
2. ✅ Verify ngnetic-mcp connection
3. ✅ Create a test PR
4. ✅ Review Bob's feedback
5. ✅ Customize review criteria as needed
6. ✅ Roll out to production PRs

---

**Made with Bob** 🤖