#!/usr/bin/env python3
"""
Bob AI PR Governance Review Script
Uses Claude API (direct or via ICA) with MCP servers to perform autonomous PR reviews
"""

import os
import sys
import json
import requests
from pathlib import Path

# Try to import anthropic, but make it optional for ICA usage
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False
    print("⚠️ Anthropic SDK not available, will use ICA models if configured")

def load_mcp_config():
    """Load MCP configuration"""
    config_path = Path(".bob/mcp.json")
    if not config_path.exists():
        raise FileNotFoundError(f"MCP config not found at {config_path}")
    
    with open(config_path) as f:
        return json.load(f)

def load_pr_context():
    """Load PR context"""
    context_path = Path("pr-context.json")
    if not context_path.exists():
        raise FileNotFoundError(f"PR context not found at {context_path}")
    
    with open(context_path) as f:
        return json.load(f)

def load_review_prompt():
    """Load review prompt"""
    prompt_path = Path("bob-review-prompt.md")
    if not prompt_path.exists():
        raise FileNotFoundError(f"Review prompt not found at {prompt_path}")
    
    with open(prompt_path) as f:
        return f.read()

def call_ica_model(prompt, system_prompt, mcp_config):
    """Call ICA model endpoint (when configured)"""
    ica_endpoint = os.getenv("ICA_MODEL_ENDPOINT")
    ica_api_key = os.getenv("ICA_API_KEY") or os.getenv("NGNETIC_MCP_API_KEY")
    
    if not ica_endpoint:
        raise ValueError("ICA_MODEL_ENDPOINT not configured")
    
    print(f"🔗 Calling ICA model at {ica_endpoint}")
    
    # Prepare request (adjust format based on ICA API)
    headers = {
        "Authorization": f"Bearer {ica_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": os.getenv("ICA_MODEL_NAME", "claude-3-5-sonnet"),
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 8000,
        "mcp_config": mcp_config
    }
    
    response = requests.post(ica_endpoint, headers=headers, json=payload, timeout=300)
    response.raise_for_status()
    
    return response.json()

def perform_bob_review():
    """Perform Bob AI governance review using Claude with MCP"""
    
    # Load configurations
    print("📋 Loading configurations...")
    mcp_config = load_mcp_config()
    pr_context = load_pr_context()
    review_prompt = load_review_prompt()
    
    # Check if using ICA or direct Claude API
    use_ica = os.getenv("USE_ICA_MODELS", "false").lower() == "true"
    
    if use_ica:
        print("🔗 Using ICA models for Bob AI...")
        ica_endpoint = os.getenv("ICA_MODEL_ENDPOINT")
        if not ica_endpoint:
            print("⚠️ ICA_MODEL_ENDPOINT not set, falling back to direct Claude API")
            use_ica = False
    
    if not use_ica:
        # Get Claude API key for direct access
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set (required when not using ICA)")
        
        if not HAS_ANTHROPIC:
            raise ImportError("anthropic package not installed. Run: pip install anthropic")
        
        # Initialize Claude client
        print("🤖 Initializing Claude API client...")
        client = anthropic.Anthropic(api_key=api_key)
    
    # Prepare the system prompt for Bob
    system_prompt = """You are Bob, a highly skilled software engineer and Angular expert conducting an autonomous PR governance review.

You have access to MCP (Model Context Protocol) servers that allow you to:
1. Access the ngnetic-mcp server with GitHub connector to read PR details and post comments
2. Retrieve Angular enterprise governance standards
3. Analyze code quality, security, accessibility, and performance

Your task is to perform a comprehensive review and post your findings directly to the GitHub PR using the MCP tools available to you."""

    # Prepare the user message with PR context
    user_message = f"""# PR Review Task

{review_prompt}

## Current PR Context
```json
{json.dumps(pr_context, indent=2)}
```

## Instructions
1. Use the ngnetic-mcp server to access the GitHub PR
2. Analyze all changed files in the PR
3. Check for:
   - RxJS memory leaks (unsubscribed observables)
   - Direct fetch() usage instead of HttpClient
   - Missing accessibility attributes (ARIA labels, alt text)
   - Security vulnerabilities
   - Code quality issues
   - Performance problems
4. Post inline comments on specific lines where issues are found
5. Create a comprehensive review summary comment
6. Provide actionable fix suggestions with code examples

Begin your autonomous review now using the MCP tools."""

    print("🔍 Starting Bob AI governance review...")
    print(f"📊 Reviewing PR #{pr_context['pr_number']}: {pr_context['pr_title']}")
    
    try:
        if use_ica:
            # Use ICA model endpoint
            response_data = call_ica_model(user_message, system_prompt, mcp_config)
            
            # Extract review results from ICA response
            review_output = {
                "status": "completed",
                "model": response_data.get("model", "ica-model"),
                "usage": response_data.get("usage", {}),
                "summary": {
                    "critical": 0,
                    "warnings": 0,
                    "suggestions": 0,
                    "description": "Bob AI has posted review comments directly to the PR using MCP via ICA"
                },
                "response": response_data.get("content", "")
            }
            
            response_text = review_output["response"]
        else:
            # Use direct Claude API
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=8000,
                system=system_prompt,
                messages=[
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                # Enable MCP tools
                tools=[
                    {
                        "type": "mcp",
                        "mcp_servers": mcp_config["mcpServers"]
                    }
                ]
            )
            
            # Extract review results
            review_output = {
                "status": "completed",
                "model": response.model,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens
                },
                "summary": {
                    "critical": 0,
                    "warnings": 0,
                    "suggestions": 0,
                    "description": "Bob AI has posted review comments directly to the PR using MCP"
                },
                "response": response.content[0].text if response.content else ""
            }
            
            response_text = response.content[0].text if response.content else ""
        
        print("✅ Bob review completed successfully")
        
        # Parse response to count issues
        review_output["summary"]["critical"] = response_text.count("🔴")
        review_output["summary"]["warnings"] = response_text.count("🟡")
        review_output["summary"]["suggestions"] = response_text.count("🟢")
        
        # Save output
        output_path = Path("bob-review-output.json")
        with open(output_path, "w") as f:
            json.dump(review_output, f, indent=2)
        
        print(f"📄 Review output saved to {output_path}")
        print(f"🔴 Critical: {review_output['summary']['critical']}")
        print(f"🟡 Warnings: {review_output['summary']['warnings']}")
        print(f"🟢 Suggestions: {review_output['summary']['suggestions']}")
        
        return review_output
        
    except Exception as e:
        print(f"❌ Error during Bob review: {str(e)}", file=sys.stderr)
        
        # Create error output
        error_output = {
            "status": "error",
            "error": str(e),
            "summary": {
                "critical": 0,
                "warnings": 0,
                "suggestions": 0,
                "description": f"Review failed: {str(e)}"
            }
        }
        
        output_path = Path("bob-review-output.json")
        with open(output_path, "w") as f:
            json.dump(error_output, f, indent=2)
        
        raise

if __name__ == "__main__":
    try:
        result = perform_bob_review()
        
        # Exit with error code if critical issues found
        if result["summary"]["critical"] > 0:
            print(f"\n❌ Found {result['summary']['critical']} critical issues")
            sys.exit(1)
        else:
            print("\n✅ Review completed successfully")
            sys.exit(0)
            
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}", file=sys.stderr)
        sys.exit(1)

# Made with Bob
