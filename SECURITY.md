# Security Policy

## 🔒 Protecting Sensitive Information

This project contains configuration files that require sensitive credentials. Follow these guidelines to keep your credentials secure.

## ⚠️ NEVER Commit These Files

The following files contain sensitive information and are excluded via `.gitignore`:

- `.env` - Environment variables with tokens and secrets
- `.bob/mcp.json` - MCP configuration with API keys and tokens

## ✅ Setup Instructions

### 1. Create Your Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with your actual credentials
# NEVER commit the .env file!
```

### 2. Configure Bob MCP

```bash
# Copy the example MCP configuration
cp .bob/mcp.json.example .bob/mcp.json

# Edit with your actual credentials
# NEVER commit the .bob/mcp.json file!
```

### 3. Set Your Credentials

Edit `.env` with your actual values:

```bash
# GitHub Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_YOUR_ACTUAL_TOKEN
GITHUB_HOST=https://github.ibm.com

# Ngnetic MCP Configuration
NGNETIC_MCP_URL=https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/YOUR_SERVER_ID/mcp
NGNETIC_MCP_BEARER_TOKEN=YOUR_ACTUAL_BEARER_TOKEN
NGNETIC_MCP_API_KEY=YOUR_ACTUAL_API_KEY
```

### 4. Update MCP Configuration

The `.bob/mcp.json` file will automatically use environment variables if you set them up correctly.

## 🔐 GitHub Actions Secrets

For CI/CD workflows, add these secrets to your GitHub repository:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Add the following secrets:
   - `GITHUB_TOKEN` (automatically provided by GitHub)
   - `NGNETIC_MCP_BEARER_TOKEN` (if needed for workflows)
   - `NGNETIC_MCP_API_KEY` (if needed for workflows)

## 🚨 If You Accidentally Commit Secrets

If you accidentally commit sensitive information:

1. **Immediately revoke/regenerate** all exposed tokens and keys
2. **Remove the sensitive data** from Git history:
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .bob/mcp.json" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** to remote (⚠️ coordinate with team):
   ```bash
   git push origin --force --all
   ```
4. **Notify your security team** immediately

## 📋 Security Checklist

Before committing:

- [ ] `.env` is in `.gitignore`
- [ ] `.bob/mcp.json` is in `.gitignore`
- [ ] No tokens/passwords in committed files
- [ ] Only `.example` files are committed
- [ ] GitHub Actions uses secrets, not hardcoded values
- [ ] All team members have been informed

## 🔍 Verify Before Pushing

Always check what you're about to commit:

```bash
# Check staged files
git status

# Review changes
git diff --cached

# Ensure no secrets are included
git diff --cached | grep -i "token\|password\|secret\|key"
```

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email the security team directly
3. Include details about the vulnerability
4. Wait for acknowledgment before disclosure

## 🛡️ Best Practices

1. **Rotate credentials regularly** (every 90 days)
2. **Use least privilege** - only grant necessary permissions
3. **Enable 2FA** on all accounts
4. **Monitor access logs** for suspicious activity
5. **Keep dependencies updated** to patch vulnerabilities
6. **Use GitHub's secret scanning** to detect exposed secrets

## 📚 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [IBM Security Guidelines](https://www.ibm.com/security)

---

**Remember**: Security is everyone's responsibility. When in doubt, ask! 🔒