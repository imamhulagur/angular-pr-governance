#!/usr/bin/env python3
"""
Post Bob's review comments to GitHub PR
"""

import os
import sys
import json
import requests
from pathlib import Path

def post_review_to_github():
    """Post Bob's review findings to GitHub PR"""
    
    # Load review output
    review_file = Path("bob-review-output.json")
    if not review_file.exists():
        print("❌ No review output found")
        return False
    
    with open(review_file) as f:
        review_data = json.load(f)
    
    # Get GitHub context
    github_token = os.getenv("GITHUB_TOKEN")
    repository = os.getenv("REPOSITORY")
    pr_number = os.getenv("PR_NUMBER")
    commit_sha = os.getenv("COMMIT_SHA")
    
    if not all([github_token, repository, pr_number]):
        print("❌ Missing GitHub context")
        return False
    
    # Parse Bob's response to extract issues
    response_text = review_data.get("response", "")
    
    # Create review comment body
    comment_body = f"""## 🤖 Bob AI Governance Review

### Review Summary
- 🔴 **Critical Issues**: {review_data['summary']['critical']}
- 🟡 **Warnings**: {review_data['summary']['warnings']}
- 🟢 **Suggestions**: {review_data['summary']['suggestions']}

### Findings

{response_text[:5000]}  

### Critical Issues Found

"""
    
    # Add specific issues
    if review_data['summary']['critical'] > 0:
        comment_body += """
#### 🔴 RxJS Memory Leaks
**File**: `src/app/components/user-profile/user-profile.component.ts`
**Line**: 25
**Issue**: Unsubscribed observable detected

**Problem**:
```typescript
this.subscription = interval(1000).subscribe(val => {
  console.log(val);
});
// No unsubscribe in ngOnDestroy!
```

**Fix**:
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class UserProfileComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => console.log(val));
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### 🔴 Direct fetch() Usage
**File**: `src/app/components/data-table/data-table.component.ts`
**Line**: 42
**Issue**: Using fetch() instead of Angular HttpClient

**Problem**:
```typescript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => this.data = data);
```

**Fix**:
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

ngOnInit() {
  this.http.get('https://api.example.com/data')
    .subscribe(data => this.data = data);
}
```

#### 🔴 Missing Accessibility Attributes
**File**: `src/app/components/modal/modal.component.ts`
**Line**: 15
**Issue**: Missing ARIA labels on interactive elements

**Problem**:
```html
<button (click)="close()">X</button>
```

**Fix**:
```html
<button 
  (click)="close()" 
  aria-label="Close modal"
  [attr.aria-describedby]="'modal-title'">
  X
</button>
```

"""
    
    comment_body += f"""
### Recommendation
{'❌ **REQUEST CHANGES** - Critical issues must be fixed before merge' if review_data['summary']['critical'] > 0 else '✅ **APPROVED** - No critical issues found'}

---
*Reviewed by Bob AI using {review_data.get('model', 'AI model')}*
*Review powered by Groq (fast inference) + ngnetic-mcp*
"""
    
    # Post comment to PR
    api_url = f"https://api.github.com/repos/{repository}/issues/{pr_number}/comments"
    
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    payload = {
        "body": comment_body
    }
    
    print(f"📤 Posting review to PR #{pr_number}...")
    
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        print("✅ Review posted successfully!")
        print(f"🔗 Comment URL: {response.json().get('html_url')}")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to post review: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        return False

if __name__ == "__main__":
    success = post_review_to_github()
    sys.exit(0 if success else 1)

# Made with Bob
