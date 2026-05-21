# Angular PR Review Checklist

Use this checklist to ensure comprehensive review of Angular pull requests. Check off items as you review them.

## 📋 Pre-Review Checks

- [ ] PR has a clear, descriptive title
- [ ] PR description explains the changes and reasoning
- [ ] PR is linked to relevant issue/ticket
- [ ] PR size is reasonable (< 500 lines changed recommended)
- [ ] All CI/CD checks are passing
- [ ] No merge conflicts exist
- [ ] Branch is up-to-date with target branch

---

## 🏗️ Architecture & Design

### Component Architecture
- [ ] Components follow Single Responsibility Principle
- [ ] Component hierarchy is logical and maintainable
- [ ] Smart/Container vs Dumb/Presentational components are properly separated
- [ ] Component communication uses appropriate patterns (@Input, @Output, Services)
- [ ] No circular dependencies between components/modules

### Module Organization
- [ ] Feature modules are properly structured
- [ ] Shared modules contain only reusable components
- [ ] Core module contains singleton services
- [ ] Lazy loading is implemented where appropriate
- [ ] Module imports are minimal and necessary

### State Management
- [ ] State management approach is consistent (NgRx, Akita, Services, etc.)
- [ ] State is immutable where required
- [ ] Side effects are handled properly
- [ ] No unnecessary state duplication

---

## 💻 Code Quality

### TypeScript Best Practices
- [ ] Strong typing is used (no `any` unless justified)
- [ ] Interfaces/types are defined for data structures
- [ ] Enums are used for constants where appropriate
- [ ] Type guards are used for type narrowing
- [ ] Generic types are used appropriately

### Angular Best Practices
- [ ] Components use OnPush change detection where possible
- [ ] Lifecycle hooks are implemented correctly
- [ ] Unsubscriptions are handled (takeUntil, async pipe, etc.)
- [ ] Dependency injection is used properly
- [ ] Services are provided at appropriate levels

### Code Style
- [ ] Code follows Angular Style Guide
- [ ] Naming conventions are consistent (kebab-case for selectors, camelCase for properties)
- [ ] Code is readable and self-documenting
- [ ] Complex logic has explanatory comments
- [ ] No commented-out code (unless with explanation)
- [ ] No console.log statements in production code

### Performance
- [ ] No unnecessary change detection triggers
- [ ] TrackBy functions used in *ngFor loops
- [ ] Async pipe used for observables in templates
- [ ] Large lists use virtual scrolling if needed
- [ ] Images are optimized and lazy-loaded
- [ ] Bundle size impact is acceptable

---

## 🎨 Templates & Styling

### Template Quality
- [ ] Templates are clean and readable
- [ ] No complex logic in templates (move to component)
- [ ] Proper use of structural directives (*ngIf, *ngFor, *ngSwitch)
- [ ] Template expressions are simple
- [ ] No inline styles (use CSS classes)

### Accessibility (a11y)
- [ ] Semantic HTML elements used appropriately
- [ ] ARIA labels present where needed
- [ ] Keyboard navigation works correctly
- [ ] Focus management is handled properly
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Screen reader compatibility verified

### Responsive Design
- [ ] Layout works on mobile, tablet, and desktop
- [ ] Breakpoints are used appropriately
- [ ] Touch targets are adequately sized (min 44x44px)
- [ ] No horizontal scrolling on mobile

### Styling
- [ ] CSS follows BEM or consistent naming convention
- [ ] No global style pollution
- [ ] ViewEncapsulation is appropriate
- [ ] CSS is DRY (Don't Repeat Yourself)
- [ ] Animations are smooth and purposeful

---

## 🧪 Testing

### Unit Tests
- [ ] New components have unit tests
- [ ] New services have unit tests
- [ ] New pipes/directives have unit tests
- [ ] Tests are meaningful (not just for coverage)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Mock dependencies appropriately
- [ ] Code coverage meets threshold (≥80%)

### Integration Tests
- [ ] Critical user flows have integration tests
- [ ] Component interactions are tested
- [ ] Service integrations are tested

### E2E Tests
- [ ] Critical user journeys have E2E tests (if applicable)
- [ ] E2E tests are stable and not flaky

### Test Quality
- [ ] Tests are readable and maintainable
- [ ] Test descriptions are clear
- [ ] No skipped tests without explanation
- [ ] Tests run quickly
- [ ] No test interdependencies

---

## 🔒 Security

### Input Validation
- [ ] User inputs are validated
- [ ] XSS vulnerabilities are prevented
- [ ] SQL injection is prevented (if applicable)
- [ ] CSRF protection is in place

### Authentication & Authorization
- [ ] Authentication is properly implemented
- [ ] Authorization checks are in place
- [ ] Sensitive data is not exposed in client
- [ ] Tokens are stored securely

### Dependencies
- [ ] No known security vulnerabilities in dependencies
- [ ] Dependencies are up-to-date
- [ ] Unnecessary dependencies are removed

### Data Handling
- [ ] Sensitive data is not logged
- [ ] API keys/secrets are not hardcoded
- [ ] Personal data handling complies with regulations (GDPR, etc.)

---

## 🚀 Performance & Optimization

### Bundle Size
- [ ] Bundle size increase is justified
- [ ] Tree shaking is effective
- [ ] Lazy loading is used for large features
- [ ] Unused code is removed

### Runtime Performance
- [ ] No memory leaks (subscriptions cleaned up)
- [ ] No unnecessary re-renders
- [ ] Expensive operations are optimized
- [ ] Debouncing/throttling used where appropriate

### Network Performance
- [ ] API calls are optimized (batching, caching)
- [ ] Images are compressed and optimized
- [ ] HTTP requests are minimized
- [ ] Proper caching strategies implemented

---

## 📚 Documentation

### Code Documentation
- [ ] Complex logic is documented
- [ ] Public APIs have JSDoc comments
- [ ] Component inputs/outputs are documented
- [ ] Service methods are documented

### Project Documentation
- [ ] README updated if needed
- [ ] CHANGELOG updated
- [ ] API documentation updated
- [ ] Architecture diagrams updated if needed

### User Documentation
- [ ] User-facing changes are documented
- [ ] Help text/tooltips are clear
- [ ] Error messages are helpful

---

## 🔄 Data Flow & State

### RxJS & Observables
- [ ] Observables are used appropriately
- [ ] Subscriptions are managed properly
- [ ] Error handling is implemented
- [ ] Operators are used efficiently
- [ ] No nested subscriptions

### HTTP & API
- [ ] API calls use proper HTTP methods
- [ ] Error responses are handled gracefully
- [ ] Loading states are shown to users
- [ ] Retry logic is implemented where appropriate
- [ ] API responses are typed

### Forms
- [ ] Reactive forms used for complex forms
- [ ] Form validation is comprehensive
- [ ] Error messages are user-friendly
- [ ] Form state is managed properly
- [ ] Dirty/pristine states are handled

---

## 🌐 Internationalization (i18n)

- [ ] Text is externalized for translation
- [ ] Date/time formatting is locale-aware
- [ ] Number formatting is locale-aware
- [ ] RTL support if required
- [ ] Translation keys are meaningful

---

## ♿ Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Keyboard shortcuts don't conflict

### Screen Readers
- [ ] Content is announced correctly
- [ ] Dynamic content updates are announced
- [ ] Form labels are associated properly
- [ ] Error messages are announced

### Visual
- [ ] Text has sufficient contrast
- [ ] UI works with 200% zoom
- [ ] No information conveyed by color alone
- [ ] Animations can be disabled

---

## 🐛 Error Handling

- [ ] Errors are caught and handled gracefully
- [ ] User-friendly error messages displayed
- [ ] Errors are logged appropriately
- [ ] Fallback UI for error states
- [ ] Network errors are handled

---

## 🔧 Configuration & Environment

- [ ] Environment-specific configs are correct
- [ ] Feature flags are used appropriately
- [ ] No hardcoded environment values
- [ ] Configuration is validated

---

## 📱 Mobile Considerations

- [ ] Touch gestures work correctly
- [ ] Performance is acceptable on mobile devices
- [ ] Mobile-specific features are implemented
- [ ] Offline functionality if required

---

## 🔍 Code Review Best Practices

### For Reviewers
- [ ] Review within 24 hours
- [ ] Provide constructive feedback
- [ ] Ask questions for clarification
- [ ] Suggest improvements, don't demand
- [ ] Approve when standards are met
- [ ] Test the changes locally if needed

### For Authors
- [ ] Respond to feedback promptly
- [ ] Explain design decisions
- [ ] Make requested changes
- [ ] Re-request review after changes
- [ ] Thank reviewers for their time

---

## ✅ Final Checks

- [ ] All automated checks passed
- [ ] All review comments addressed
- [ ] Required approvals obtained
- [ ] No merge conflicts
- [ ] Branch is up-to-date
- [ ] Ready to merge

---

## 📊 Review Outcome

**Decision**: [ ] Approve | [ ] Request Changes | [ ] Comment

**Summary**:
<!-- Provide a brief summary of your review -->

**Strengths**:
<!-- What was done well? -->

**Areas for Improvement**:
<!-- What could be better? -->

**Action Items**:
<!-- What needs to be done before merge? -->

---

## 🎯 Priority Levels

Use these priority indicators in your review comments:

- 🔴 **Critical**: Must be fixed before merge (security, breaking changes)
- 🟡 **Important**: Should be fixed before merge (bugs, performance issues)
- 🟢 **Nice to have**: Can be addressed in future PR (refactoring, optimization)
- 💡 **Suggestion**: Optional improvement (style, alternative approach)

---

## 📝 Notes

- This checklist is comprehensive; not all items apply to every PR
- Use judgment to determine which items are relevant
- Add custom checks specific to your project
- Update this checklist as your team's practices evolve

**Last Updated**: 2026-05-21
**Version**: 1.0.0