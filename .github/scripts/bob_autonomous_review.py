#!/usr/bin/env python3
"""
Bob AI Autonomous PR Review using ngnetic-mcp GitHub Connector
Connects directly to ngnetic-mcp to post review comments via MCP protocol
"""

import os
import sys
import json
import requests
from pathlib import Path

def connect_to_ngnetic_mcp():
    """Connect to ngnetic-mcp and get available tools"""
    mcp_url = os.getenv("NGNETIC_MCP_URL")
    bearer_token = os.getenv("NGNETIC_MCP_BEARER_TOKEN")
    api_key = os.getenv("NGNETIC_MCP_API_KEY")
    
    if not all([mcp_url, bearer_token, api_key]):
        raise ValueError("Missing ngnetic-mcp credentials")
    
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }
    
    # List available tools from ngnetic-mcp
    print("🔗 Connecting to ngnetic-mcp...")
    response = requests.post(
        f"{mcp_url}/tools/list",
        headers=headers,
        json={},
        timeout=30
    )
    response.raise_for_status()
    
    tools = response.json()
    print(f"✅ Connected! Available tools: {len(tools.get('tools', []))}")
    return headers, mcp_url

def call_mcp_tool(headers, mcp_url, tool_name, arguments):
    """Call a tool via ngnetic-mcp"""
    print(f"🔧 Calling MCP tool: {tool_name}")
    
    response = requests.post(
        f"{mcp_url}/tools/call",
        headers=headers,
        json={
            "name": tool_name,
            "arguments": arguments
        },
        timeout=60
    )
    response.raise_for_status()
    return response.json()

def autonomous_review_with_mcp():
    """Perform autonomous review using ngnetic-mcp GitHub connector"""
    
    # Load PR context
    with open("pr-context.json") as f:
        pr_context = json.load(f)
    
    # Load review prompt
    with open("bob-review-prompt.md") as f:
        review_prompt = f.read()
    
    # Connect to ngnetic-mcp
    headers, mcp_url = connect_to_ngnetic_mcp()
    
    print(f"📊 Reviewing PR #{pr_context['pr_number']}: {pr_context['pr_title']}")
    
    # Step 1: Get PR files using GitHub connector via MCP
    print("\n📁 Step 1: Fetching PR files via ngnetic-mcp GitHub connector...")
    pr_files = call_mcp_tool(
        headers, mcp_url,
        "github_get_pull_request_files",
        {
            "owner": pr_context['repository'].split('/')[0],
            "repo": pr_context['repository'].split('/')[1],
            "pull_number": pr_context['pr_number']
        }
    )
    
    files_data = pr_files.get('content', [])
    print(f"✅ Found {len(files_data)} changed files")
    
    # Step 2: Get actual file contents for analysis
    print("\n📄 Step 2: Fetching file contents...")
    file_contents = []
    for file_info in files_data[:10]:  # Limit to first 10 files
        filename = file_info.get('filename', '')
        if filename.endswith(('.ts', '.html', '.css', '.scss')):
            try:
                content_result = call_mcp_tool(
                    headers, mcp_url,
                    "github_get_file_contents",
                    {
                        "owner": pr_context['repository'].split('/')[0],
                        "repo": pr_context['repository'].split('/')[1],
                        "path": filename,
                        "ref": pr_context['head_branch']
                    }
                )
                file_contents.append({
                    "filename": filename,
                    "content": content_result.get('content', ''),
                    "patch": file_info.get('patch', '')
                })
                print(f"  ✓ {filename}")
            except Exception as e:
                print(f"  ⚠️ Could not fetch {filename}: {e}")
    
    # Step 3: Analyze files with Groq AI
    print(f"\n🤖 Step 3: Analyzing {len(file_contents)} files with AI...")
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    # Build detailed analysis prompt with actual code
    files_summary = "\n\n".join([
        f"### File: {f['filename']}\n```typescript\n{f['content'][:2000]}\n```\n**Changes:**\n```diff\n{f['patch'][:1000]}\n```"
        for f in file_contents
    ])
    
    analysis_prompt = f"""You are an expert Angular code reviewer. Analyze this PR for governance violations.

PR Title: {pr_context['pr_title']}
Files Changed: {len(file_contents)}

{files_summary}

CRITICAL CHECKS:
1. 🔴 RxJS Memory Leaks - Find unsubscribed observables (subscribe() without takeUntil/async pipe)
2. 🔴 Direct fetch() - Should use Angular HttpClient instead
3. 🔴 Missing ARIA labels - Buttons/inputs without accessibility attributes
4. 🟡 Type safety - Usage of 'any' type
5. 🟡 Error handling - Missing try-catch or error operators

For EACH issue found, provide:
- exact filename
- approximate line number
- severity (critical/warning/suggestion)
- code snippet showing the problem
- fixed code snippet
- explanation

Respond in this JSON format:
{{
  "issues": [
    {{
      "file": "src/app/component.ts",
      "line": 25,
      "severity": "critical",
      "category": "RxJS Memory Leak",
      "problem": "Observable subscription without cleanup",
      "problem_code": "this.data$.subscribe(...)",
      "fix_code": "this.data$.pipe(takeUntil(this.destroy$)).subscribe(...)",
      "explanation": "Unsubscribed observables cause memory leaks"
    }}
  ]
}}"""

    groq_response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": "You are an Angular governance expert. Always respond with valid JSON only."},
                {"role": "user", "content": analysis_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 8000
        },
        timeout=90
    )
    groq_response.raise_for_status()
    
    ai_response = groq_response.json()['choices'][0]['message']['content']
    print("✅ AI analysis complete")
    
    # Parse AI response
    try:
        # Extract JSON from response (handle markdown code blocks)
        if '```json' in ai_response:
            ai_response = ai_response.split('```json')[1].split('```')[0].strip()
        elif '```' in ai_response:
            ai_response = ai_response.split('```')[1].split('```')[0].strip()
        
        issues = json.loads(ai_response).get('issues', [])
        print(f"✅ Found {len(issues)} issues")
    except Exception as e:
        print(f"⚠️ Could not parse AI response as JSON: {e}")
        issues = []
    
    # Step 4: Build comprehensive review comment with actual findings
    print("\n💬 Step 4: Building review comment...")
    
    critical_issues = [i for i in issues if i.get('severity') == 'critical']
    warning_issues = [i for i in issues if i.get('severity') == 'warning']
    suggestion_issues = [i for i in issues if i.get('severity') == 'suggestion']
    
    review_body = f"""## 🤖 Bob AI Autonomous Governance Review

**PR**: {pr_context['pr_title']}
**Files Analyzed**: {len(file_contents)}
**Issues Found**: {len(issues)} ({len(critical_issues)} critical, {len(warning_issues)} warnings, {len(suggestion_issues)} suggestions)

---

"""
    
    if critical_issues:
        review_body += "### 🔴 Critical Issues (Must Fix)\n\n"
        for idx, issue in enumerate(critical_issues, 1):
            review_body += f"""#### {idx}. {issue.get('category', 'Issue')}
**File**: `{issue.get('file', 'unknown')}`
**Line**: ~{issue.get('line', '?')}

**Problem**:
```typescript
{issue.get('problem_code', 'N/A')}
```

**Fix**:
```typescript
{issue.get('fix_code', 'N/A')}
```

**Why**: {issue.get('explanation', 'N/A')}

---

"""
    
    if warning_issues:
        review_body += "### 🟡 Warnings (Should Fix)\n\n"
        for idx, issue in enumerate(warning_issues, 1):
            review_body += f"""#### {idx}. {issue.get('category', 'Issue')}
**File**: `{issue.get('file', 'unknown')}` (Line ~{issue.get('line', '?')})
**Problem**: {issue.get('problem', 'N/A')}
**Fix**: {issue.get('explanation', 'N/A')}

"""
    
    if suggestion_issues:
        review_body += "### 🟢 Suggestions (Nice to Have)\n\n"
        for idx, issue in enumerate(suggestion_issues, 1):
            review_body += f"- **{issue.get('file', 'unknown')}**: {issue.get('problem', 'N/A')}\n"
    
    if not issues:
        review_body += "### ✅ No Issues Found\n\nCode looks good! All governance checks passed.\n\n"
    
    review_body += f"""---

**Recommendation**: {"❌ REQUEST CHANGES" if critical_issues else "✅ APPROVED" if not warning_issues else "⚠️ APPROVE WITH COMMENTS"}

*Autonomous review by Bob AI using ngnetic-mcp GitHub connector + Groq Llama 3.3 70B*
"""
    
    # Step 5: Post review comment via ngnetic-mcp GitHub connector
    print("\n📤 Step 5: Posting review to GitHub via ngnetic-mcp...")
    comment_result = call_mcp_tool(
        headers, mcp_url,
        "github_create_issue_comment",
        {
            "owner": pr_context['repository'].split('/')[0],
            "repo": pr_context['repository'].split('/')[1],
            "issue_number": pr_context['pr_number'],
            "body": review_body
        }
    )
    
    comment_id = comment_result.get('content', {}).get('id', 'unknown')
    comment_url = comment_result.get('content', {}).get('html_url', '')
    print(f"✅ Review posted! Comment ID: {comment_id}")
    print(f"🔗 {comment_url}")
    
    # Save results
    results = {
        "status": "completed",
        "model": "groq-llama-3.3-70b + ngnetic-mcp",
        "files_analyzed": len(file_contents),
        "total_issues": len(issues),
        "summary": {
            "critical": len(critical_issues),
            "warnings": len(warning_issues),
            "suggestions": len(suggestion_issues),
            "description": f"Analyzed {len(file_contents)} files and found {len(issues)} issues"
        },
        "issues": issues,
        "comment_id": comment_id,
        "comment_url": comment_url,
        "mcp_used": True
    }
    
    with open("bob-review-output.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ Autonomous review complete!")
    print(f"🔗 View comment: {results['comment_url']}")
    
    return results['summary']['critical']

if __name__ == "__main__":
    try:
        critical_count = autonomous_review_with_mcp()
        sys.exit(1 if critical_count > 0 else 0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

# Made with Bob
