# Angular Enterprise Governance Rules

## Overview
This document outlines the strict enterprise standards that all Angular code must adhere to in our organization. These rules are enforced through automated PR reviews and manual code reviews.

---

## 1. Memory Management & RxJS Best Practices

### Rule: Mandatory Subscription Cleanup
**Severity: CRITICAL**

All RxJS subscriptions MUST be properly cleaned up to prevent memory leaks.

#### ✅ Approved Patterns (Angular 16+)

**Pattern 1: Using `takeUntilDestroyed()` (Recommended)**
```typescript
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({...})
export class MyComponent implements OnInit {
  constructor() {}
  
  ngOnInit(): void {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        // Automatically unsubscribes when component is destroyed
      });
  }
}
```

**Pattern 2: Using `async` pipe in templates**
```typescript
@Component({
  template: `<div>{{ data$ | async }}</div>`
})
export class MyComponent {
  data$ = this.service.getData();
}
```

**Pattern 3: Manual cleanup with `ngOnDestroy`**
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({...})
export class MyComponent implements OnDestroy {
  private subscription = new Subscription();
  
  ngOnInit(): void {
    this.subscription.add(
      this.service.getData().subscribe(...)
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

#### ❌ Violations

```typescript
// WRONG: No cleanup mechanism
ngOnInit(): void {
  interval(1000).subscribe(value => {
    // This will leak memory!
  });
}
```

### Enforcement
- All subscriptions must use one of the approved cleanup patterns
- PR reviews will automatically flag subscriptions without cleanup
- Build will fail if memory leak patterns are detected

---

## 2. Clean Architecture & Separation of Concerns

### Rule: Components Must Not Make Direct HTTP Requests
**Severity: CRITICAL**

Components are responsible for presentation logic only. All data access must go through services.

#### ✅ Correct Pattern

**Service Layer:**
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  updateUser(id: number, data: User): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, data);
  }
}
```

**Component Layer:**
```typescript
@Component({...})
export class UserComponent {
  constructor(private userService: UserService) {}
  
  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  
  saveUser(user: User): void {
    this.userService.updateUser(user.id, user).subscribe(...);
  }
}
```

#### ❌ Violations

```typescript
// WRONG: Component making direct HTTP request
@Component({...})
export class UserComponent {
  saveUser(user: User): void {
    // Direct fetch() call bypasses service layer
    fetch('/api/users/' + user.id, {
      method: 'PUT',
      body: JSON.stringify(user)
    }).then(...);
  }
}
```

```typescript
// WRONG: Component using HttpClient directly
@Component({...})
export class UserComponent {
  constructor(private http: HttpClient) {} // Should inject service instead
  
  loadUsers(): void {
    this.http.get('/api/users').subscribe(...); // Should use service
  }
}
```

### Enforcement
- Components must not import `HttpClient`
- Components must not use `fetch()`, `XMLHttpRequest`, or any direct HTTP APIs
- All HTTP operations must be encapsulated in services
- PR reviews will automatically flag direct HTTP usage in components

---

## 3. Web Accessibility (a11y) Standards

### Rule: All Interactive Elements Must Be Accessible
**Severity: HIGH**

All interactive elements must be keyboard accessible and properly labeled for screen readers.

#### ✅ Correct Patterns

**Pattern 1: Use Semantic HTML**
```html
<!-- Native button element -->
<button (click)="save()">Save</button>

<!-- Native link element -->
<a href="/profile" routerLink="/profile">View Profile</a>
```

**Pattern 2: Proper ARIA Attributes for Custom Elements**
```html
<!-- Custom clickable div with proper ARIA -->
<div 
  role="button"
  tabindex="0"
  aria-label="Save user profile"
  (click)="save()"
  (keydown.enter)="save()"
  (keydown.space)="save()">
  Save
</div>
```

**Pattern 3: Form Controls with Labels**
```html
<label for="username">Username:</label>
<input 
  id="username" 
  type="text" 
  [(ngModel)]="username"
  aria-required="true"
  aria-describedby="username-help">
<span id="username-help">Enter your username</span>
```

#### ❌ Violations

```html
<!-- WRONG: Div as button without ARIA attributes -->
<div (click)="save()">Save</div>

<!-- WRONG: Missing label -->
<input type="text" [(ngModel)]="username">

<!-- WRONG: Image without alt text -->
<img src="profile.jpg">

<!-- WRONG: Custom control without keyboard support -->
<div (click)="toggle()">Toggle</div>
```

### Required Attributes

| Element Type | Required Attributes |
|--------------|-------------------|
| Custom buttons | `role="button"`, `tabindex="0"`, `aria-label` or text content |
| Custom links | `role="link"`, `tabindex="0"`, `aria-label` or text content |
| Form inputs | `id`, associated `<label>`, `aria-required` if required |
| Images | `alt` attribute (empty string if decorative) |
| Icons | `aria-label` or `aria-hidden="true"` if decorative |

### Keyboard Support Requirements

All interactive custom elements must support:
- **Enter key**: Activate the element
- **Space key**: Activate the element (for buttons)
- **Tab key**: Navigate to the element (via `tabindex`)
- **Escape key**: Close modals/dialogs

### Enforcement
- Automated accessibility testing in CI/CD pipeline
- PR reviews will flag missing ARIA attributes
- Lighthouse accessibility score must be ≥ 90
- Manual accessibility audit required for new features

---

## 4. Additional Standards

### TypeScript Strict Mode
- `strict: true` must be enabled in `tsconfig.json`
- No `any` types without explicit justification
- All function parameters and return types must be typed

### Component Size Limits
- Maximum 300 lines per component file
- Maximum 150 lines per template
- Complex components must be split into smaller components

### Testing Requirements
- Minimum 80% code coverage
- All components must have unit tests
- All services must have unit tests
- Critical user flows must have E2E tests

### Performance Standards
- Bundle size must not exceed 500KB (initial load)
- Lazy loading required for feature modules
- OnPush change detection strategy preferred
- No synchronous operations in constructors

---

## Enforcement & Review Process

### Automated Checks
1. **Pre-commit hooks**: Run linting and formatting
2. **PR validation**: Automated checks for all rules
3. **CI/CD pipeline**: Full test suite and quality gates
4. **Bob AI Review**: Agentic code review for governance compliance

### Manual Review Requirements
- All PRs require at least one approval
- Senior developer approval required for architectural changes
- Accessibility specialist review for UI changes
- Security review for authentication/authorization changes

### Violation Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| **CRITICAL** | Memory leaks, security issues, architectural violations | PR blocked, must fix |
| **HIGH** | Accessibility issues, performance problems | PR blocked, must fix |
| **MEDIUM** | Code quality, maintainability issues | Fix required before merge |
| **LOW** | Style issues, minor improvements | Fix recommended |

---

## Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)
- [Web Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)

---

**Last Updated**: 2026-05-22  
**Version**: 1.0.0  
**Maintained by**: Enterprise Architecture Team