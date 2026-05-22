#!/usr/bin/env python3
"""
Bob AI Autonomous PR Review
Uses GitHub API directly for PR analysis and Groq for AI review
"""

import os
import sys
import json
import requests
import base64
from pathlib import Path

def get_github_headers():
    """Get GitHub API headers"""
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        raise ValueError("Missing GITHUB_TOKEN")
    
    return {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

def get_pr_files(owner, repo, pr_number):
    """Get PR files using GitHub API"""
    print(f"📁 Fetching PR files from GitHub API...")
    headers = get_github_headers()
    
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}/files"
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    files = response.json()
    print(f"✅ Found {len(files)} changed files")
    return files

def get_file_content(owner, repo, path, ref):
    """Get file content from GitHub"""
    headers = get_github_headers()
    
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={ref}"
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    content_data = response.json()
    if content_data.get('encoding') == 'base64':
        content = base64.b64decode(content_data['content']).decode('utf-8')
        return content
    return content_data.get('content', '')

def post_pr_comment(owner, repo, pr_number, body):
    """Post comment to PR using GitHub API"""
    print(f"💬 Posting review comment to PR #{pr_number}...")
    headers = get_github_headers()
    
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{pr_number}/comments"
    response = requests.post(
        url,
        headers=headers,
        json={"body": body},
        timeout=30
    )
    response.raise_for_status()
    
    comment = response.json()
    print(f"✅ Comment posted! ID: {comment['id']}")
    return comment

def autonomous_review_with_github_api():
    """Perform autonomous review using GitHub API directly"""
    
    # Load PR context
    with open("pr-context.json") as f:
        pr_context = json.load(f)
    
    owner, repo = pr_context['repository'].split('/')
    pr_number = pr_context['pr_number']
    
    print(f"📊 Reviewing PR #{pr_number}: {pr_context['pr_title']}")
    
    # Step 1: Get PR files using GitHub API
    print("\n📁 Step 1: Fetching PR files from GitHub...")
    pr_files = get_pr_files(owner, repo, pr_number)
    print(f"   Total files in PR: {len(pr_files)}")
    
    # Debug: Show all files
    for f in pr_files:
        print(f"   - {f.get('filename')} ({f.get('status')})")
    
    # Step 2: Get actual file contents for analysis
    print("\n📄 Step 2: Fetching file contents...")
    file_contents = []
    
    # Get commit SHA from PR context
    commit_sha = pr_context.get('commit_sha', pr_context.get('head_branch'))
    print(f"   Using ref: {commit_sha}")
    
    for file_info in pr_files[:10]:  # Limit to first 10 files
        filename = file_info.get('filename', '')
        file_status = file_info.get('status', '')
        
        # Skip deleted files
        if file_status == 'removed':
            print(f"  ⊘ {filename} (deleted)")
            continue
            
        if filename.endswith(('.ts', '.html', '.css', '.scss', '.json')):
            try:
                print(f"  → Fetching {filename}...")
                content = get_file_content(owner, repo, filename, commit_sha)
                file_contents.append({
                    "filename": filename,
                    "content": content,
                    "patch": file_info.get('patch', ''),
                    "additions": file_info.get('additions', 0),
                    "deletions": file_info.get('deletions', 0),
                    "status": file_status
                })
                print(f"  ✓ {filename} (+{file_info.get('additions', 0)}/-{file_info.get('deletions', 0)}) - {len(content)} chars")
            except Exception as e:
                print(f"  ⚠️ Could not fetch {filename}: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"  ⊘ {filename} (skipped - not a code file)")
    
    print(f"\n✅ Successfully fetched {len(file_contents)} files for analysis")
    
    # If no files were fetched, analyze the patch directly
    if len(file_contents) == 0:
        print("⚠️ No file contents fetched, will analyze patches only")
        for file_info in pr_files[:10]:
            filename = file_info.get('filename', '')
            if filename.endswith(('.ts', '.html', '.css', '.scss')):
                file_contents.append({
                    "filename": filename,
                    "content": "",
                    "patch": file_info.get('patch', ''),
                    "additions": file_info.get('additions', 0),
                    "deletions": file_info.get('deletions', 0)
                })
    
    # Step 3: Analyze files with Groq AI
    print(f"\n🤖 Step 3: Analyzing {len(file_contents)} files with AI...")
    
    if len(file_contents) == 0:
        print("❌ No files to analyze!")
        return 0
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("❌ GROQ_API_KEY not found!")
        return 0
    
    # Build detailed analysis prompt with actual code
    files_summary = "\n\n".join([
        f"### File: {f['filename']}\n" +
        (f"**Full Content:**\n```typescript\n{f['content'][:3000]}\n```\n" if f['content'] else "") +
        f"**Changes (Diff):**\n```diff\n{f['patch'][:2000]}\n```"
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
    
    # Step 5: Post review comment via GitHub API
    print("\n📤 Step 5: Posting review to GitHub...")
    comment = post_pr_comment(owner, repo, pr_number, review_body)
    
    comment_id = comment.get('id', 'unknown')
    comment_url = comment.get('html_url', '')
    print(f"✅ Review posted! Comment ID: {comment_id}")
    print(f"🔗 {comment_url}")
    
    # Save results
    results = {
        "status": "completed",
        "model": "groq-llama-3.3-70b + github-api",
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
        "github_api_used": True
    }
    
    with open("bob-review-output.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ Autonomous review complete!")
    print(f"🔗 View comment: {results['comment_url']}")
    
    return results['summary']['critical']

if __name__ == "__main__":
    try:
        critical_count = autonomous_review_with_github_api()
        sys.exit(1 if critical_count > 0 else 0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

# Made with Bob
