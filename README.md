# Angular PR Governance Workflow

An autonomous governance system for Angular pull requests that ensures code quality, best practices, and consistency across your Angular projects.

## 🎯 Overview

This project provides a comprehensive PR governance workflow for Angular applications, including automated checks, review guidelines, and enforcement of Angular best practices.

## 📋 Workflow Stages

### 1. **Pre-Commit Stage**
- Linting (ESLint + Angular ESLint)
- Code formatting (Prettier)
- Unit test execution
- Type checking (TypeScript)

### 2. **PR Creation Stage**
- Automated PR template population
- Branch naming validation
- Commit message validation (Conventional Commits)
- PR size analysis

### 3. **Automated Review Stage**
- Code quality analysis (SonarQube/CodeClimate)
- Security vulnerability scanning
- Dependency audit
- Bundle size impact analysis
- Performance metrics check
- Accessibility compliance (a11y)

### 4. **Manual Review Stage**
- Architecture review
- Code review by peers
- UX/UI review (if applicable)
- Documentation review

### 5. **Pre-Merge Stage**
- All CI checks passed
- Required approvals obtained
- Conflicts resolved
- Branch up-to-date with target

### 6. **Post-Merge Stage**
- Deployment to staging
- Smoke tests
- Notification to stakeholders

## 🔍 Angular-Specific Checks

### Component Standards
- ✅ Component naming conventions (kebab-case)
- ✅ Component selector prefix validation
- ✅ OnPush change detection strategy usage
- ✅ Proper lifecycle hook implementation
- ✅ Template complexity limits
- ✅ Component size limits (lines of code)

### Module Standards
- ✅ Lazy loading implementation
- ✅ Module organization (feature/shared/core)
- ✅ Proper dependency injection
- ✅ No circular dependencies

### Service Standards
- ✅ Injectable decorator usage
- ✅ Singleton service patterns
- ✅ Proper error handling
- ✅ RxJS best practices

### Template Standards
- ✅ No complex logic in templates
- ✅ Proper use of async pipe
- ✅ Accessibility attributes (ARIA)
- ✅ i18n implementation

### Testing Standards
- ✅ Minimum code coverage (80%)
- ✅ Unit tests for components
- ✅ Unit tests for services
- ✅ Integration tests for critical flows
- ✅ E2E tests for user journeys

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Angular CLI 17+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up Git hooks

## 🔒 Security Setup

**IMPORTANT:** This project uses sensitive credentials that must NEVER be committed to Git.

### Quick Setup (Recommended)

**For Windows (PowerShell):**
```powershell
.\setup.ps1
```

**For Linux/Mac (Bash):**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Create `.env` from `.env.example`
- Create `.bob/mcp.json` from `.bob/mcp.json.example`
- Prompt for your credentials securely
- Verify `.gitignore` configuration

### Manual Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Copy MCP configuration template:**
   ```bash
   cp .bob/mcp.json.example .bob/mcp.json
   ```

3. **Edit `.env` with your credentials:**
   - GitHub Personal Access Token
   - GitHub Host URL
   - Ngnetic MCP credentials

4. **Edit `.bob/mcp.json` with your credentials:**
   - Replace all `${VARIABLE}` placeholders with actual values

5. **Verify security:**
   - Ensure `.env` and `.bob/mcp.json` are in `.gitignore`
   - NEVER commit these files!

**📖 See [SECURITY.md](SECURITY.md) for detailed security guidelines.**

npm run prepare
```

### Configuration

1. Copy `.env.example` to `.env`
2. Configure your CI/CD pipeline (see `docs/ci-cd-setup.md`)
3. Customize governance rules in `.governance/rules.json`

## 📁 Project Structure

```
.
├── .github/
│   ├── workflows/          # GitHub Actions workflows
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
├── .governance/
│   ├── rules.json          # Governance rules configuration
│   ├── checklist.md        # PR review checklist
│   └── standards.md        # Angular coding standards
├── scripts/
│   ├── pr-checks.js        # Automated PR validation
│   ├── analyze-bundle.js   # Bundle size analysis
│   └── check-dependencies.js
├── docs/
│   ├── workflow-diagram.md # Visual workflow representation
│   ├── ci-cd-setup.md      # CI/CD configuration guide
│   └── contributing.md     # Contribution guidelines
└── README.md
```

## 🔧 Governance Rules

Rules are defined in `.governance/rules.json` and include:

- **Code Quality**: Minimum quality gate scores
- **Test Coverage**: Minimum coverage thresholds
- **Bundle Size**: Maximum bundle size limits
- **Dependencies**: Allowed/blocked dependencies
- **Security**: Vulnerability severity thresholds
- **Performance**: Lighthouse score requirements

## 🤖 Automated Checks

### GitHub Actions Workflows

1. **PR Validation** (`pr-validation.yml`)
   - Runs on PR creation/update
   - Validates branch naming, commit messages
   - Runs linting and tests

2. **Code Quality** (`code-quality.yml`)
   - SonarQube analysis
   - Code coverage reporting
   - Technical debt tracking

3. **Security Scan** (`security-scan.yml`)
   - Dependency vulnerability scanning
   - SAST (Static Application Security Testing)
   - License compliance check

4. **Performance Check** (`performance-check.yml`)
   - Bundle size analysis
   - Lighthouse CI
   - Load time metrics

## 📊 Metrics & Reporting

The governance system tracks:
- PR cycle time
- Review turnaround time
- Code quality trends
- Test coverage trends
- Security vulnerability trends
- Bundle size trends

## 🎓 Best Practices

### For Contributors
1. Follow the Angular Style Guide
2. Write meaningful commit messages
3. Keep PRs small and focused
4. Add tests for new features
5. Update documentation

### For Reviewers
1. Review within 24 hours
2. Provide constructive feedback
3. Check for security issues
4. Verify test coverage
5. Validate accessibility

## 🔗 Integration

### Supported Tools
- **Version Control**: GitHub, GitLab, Bitbucket
- **CI/CD**: GitHub Actions, Jenkins, CircleCI, GitLab CI
- **Code Quality**: SonarQube, CodeClimate, Codacy
- **Security**: Snyk, WhiteSource, Dependabot
- **Testing**: Jest, Karma, Cypress, Playwright

## 📚 Documentation

- [Workflow Diagram](docs/workflow-diagram.md)
- [PR Review Checklist](.governance/checklist.md)
- [Angular Standards](.governance/standards.md)
- [CI/CD Setup Guide](docs/ci-cd-setup.md)
- [Contributing Guidelines](docs/contributing.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact the maintainers
- Check the documentation

## 🔄 Continuous Improvement

This governance workflow is continuously improved based on:
- Team feedback
- Industry best practices
- Angular framework updates
- Security advisories
- Performance benchmarks

---

**Last Updated**: 2026-05-21
**Version**: 1.0.0