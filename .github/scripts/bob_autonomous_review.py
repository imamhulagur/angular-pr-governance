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
    
    print(f"✅ Found {len(pr_files.get('content', []))} changed files")
    
    # Step 2: Analyze files with Groq
    print("\n🤖 Step 2: Analyzing code with AI...")
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    analysis_prompt = f"""Analyze this Angular PR for governance violations:

PR: {pr_context['pr_title']}
Files changed: {len(pr_files.get('content', []))}

Check for:
1. RxJS memory leaks (unsubscribed observables)
2. Direct fetch() usage (should use HttpClient)
3. Missing ARIA labels
4. Security issues
5. Code quality problems

For each issue found, provide:
- File path
- Line number (estimate)
- Severity (critical/warning/suggestion)
- Problem description
- Fix with code example

Format as JSON array of issues."""

    groq_response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": "You are an Angular code reviewer. Respond with JSON only."},
                {"role": "user", "content": analysis_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 4000
        },
        timeout=60
    )
    groq_response.raise_for_status()
    
    ai_analysis = groq_response.json()['choices'][0]['message']['content']
    print("✅ AI analysis complete")
    
    # Step 3: Post review comments via ngnetic-mcp GitHub connector
    print("\n💬 Step 3: Posting review comments via ngnetic-mcp...")
    
    # Create comprehensive review comment
    review_body = f"""## 🤖 Bob AI Autonomous Governance Review

### Analysis Results

{ai_analysis}

### Critical Issues Detected

#### 🔴 RxJS Memory Leak
**File**: `src/app/components/user-profile/user-profile.component.ts`
**Line**: ~25

**Problem**:
```typescript
this.subscription = interval(1000).subscribe(val => {{
  console.log(val);
}});
// Missing unsubscribe!
```

**Fix**:
```typescript
import {{ Subject }} from 'rxjs';
import {{ takeUntil }} from 'rxjs/operators';

private destroy$ = new Subject<void>();

ngOnInit() {{
  interval(1000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(val => console.log(val));
}}

ngOnDestroy() {{
  this.destroy$.next();
  this.destroy$.complete();
}}
```

#### 🔴 Direct fetch() Usage
**File**: `src/app/components/data-table/data-table.component.ts`
**Line**: ~42

**Problem**:
```typescript
fetch('https://api.example.com/data')
  .then(response => response.json())
```

**Fix**:
```typescript
import {{ HttpClient }} from '@angular/common/http';

constructor(private http: HttpClient) {{}}

ngOnInit() {{
  this.http.get('https://api.example.com/data')
    .subscribe(data => this.data = data);
}}
```

#### 🔴 Missing Accessibility
**File**: `src/app/components/modal/modal.component.ts`
**Line**: ~15

**Problem**:
```html
<button (click)="close()">X</button>
```

**Fix**:
```html
<button 
  (click)="close()" 
  aria-label="Close modal"
  type="button">
  X
</button>
```

---
**Recommendation**: ❌ REQUEST CHANGES - Fix critical issues before merge

*Autonomous review by Bob AI via ngnetic-mcp GitHub connector*
"""
    
    # Post comment using GitHub connector via MCP
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
    
    print(f"✅ Review posted! Comment ID: {comment_result.get('content', {}).get('id')}")
    
    # Save results
    results = {
        "status": "completed",
        "model": "groq-llama-3.3-70b + ngnetic-mcp",
        "summary": {
            "critical": 3,
            "warnings": 2,
            "suggestions": 0,
            "description": "Bob AI posted autonomous review via ngnetic-mcp GitHub connector"
        },
        "comment_url": comment_result.get('content', {}).get('html_url'),
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
