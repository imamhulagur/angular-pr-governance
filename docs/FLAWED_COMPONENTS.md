# Flawed Angular Components Documentation

This document catalogs all intentionally flawed Angular components created for the PR Governance Demo. Each component demonstrates specific Angular anti-patterns, code standard violations, and common mistakes that the automated review system should detect.

## Overview

The application now contains **6 components** with various intentional violations:

1. **User Profile Component** (existing)
2. **Data Table Component** (new)
3. **Notification Component** (new)
4. **User Form Component** (new)
5. **Dashboard Component** (new)
6. **Modal Component** (new)

---

## 1. User Profile Component

**Location:** `src/app/components/user-profile/user-profile.component.ts`

### Violations

#### 1.1 Memory Leak - Unsubscribed Observable
- **Line:** 117-123
- **Issue:** `interval()` subscription in `ngOnInit()` without cleanup
- **Impact:** Memory leak - interval continues after component destruction
- **Fix:** Use `takeUntilDestroyed()` or implement `ngOnDestroy` with subscription cleanup

#### 1.2 Architectural Drift
- **Line:** 138-153
- **Issue:** Using raw `fetch()` API instead of `UserService`
- **Impact:** Bypasses service layer, inconsistent HTTP handling
- **Fix:** Use `UserService.updateUserProfile()` method

#### 1.3 Accessibility Issue
- **Line:** 33-35
- **Issue:** `<div>` used as button without semantic HTML or ARIA attributes
- **Impact:** Not keyboard accessible, screen reader incompatible
- **Fix:** Use `<button>` element or add `role="button"`, `tabindex="0"`, `aria-label`

---

## 2. Data Table Component

**Location:** `src/app/components/data-table/data-table.component.ts`

### Violations

#### 2.1 Memory Leak - EventEmitter Subscriptions
- **Line:** 103-105
- **Issue:** Self-subscribing to own `EventEmitter` without cleanup
- **Impact:** Memory leak, subscription persists after component destruction
- **Fix:** Implement `ngOnDestroy` and unsubscribe

#### 2.2 Memory Leak - fromEvent Listeners
- **Line:** 91-93
- **Issue:** `fromEvent(document, 'click')` subscription without cleanup
- **Impact:** Event listener remains active after component destruction
- **Fix:** Store subscription and unsubscribe in `ngOnDestroy`

#### 2.3 Memory Leak - setInterval
- **Line:** 96-98
- **Issue:** `setInterval()` without `clearInterval()`
- **Impact:** Timer continues running after component destruction
- **Fix:** Store interval ID and clear in `ngOnDestroy`

#### 2.4 Code Standard - Using 'any' Type
- **Line:** 82
- **Issue:** `tableData: any[]` instead of proper interface
- **Impact:** Loss of type safety, harder to maintain
- **Fix:** Define proper interface for table data

#### 2.5 Missing OnDestroy Implementation
- **Issue:** No `ngOnDestroy` lifecycle hook implemented
- **Impact:** No cleanup for any subscriptions or timers
- **Fix:** Implement `OnDestroy` interface with cleanup logic

#### 2.6 Performance - Method Called in Template
- **Line:** 145-155
- **Issue:** `filterData()` method called in template on every change detection
- **Impact:** Severe performance degradation
- **Fix:** Use Angular pipe or computed signal

---

## 3. Notification Component

**Location:** `src/app/components/notification/notification.component.ts`

### Violations

#### 3.1 Change Detection Anti-Pattern
- **Lines:** 149, 169, 177, 184, 189
- **Issue:** Manual `detectChanges()` calls throughout component
- **Impact:** Code smell, indicates improper state management
- **Fix:** Use proper reactive patterns or default change detection

#### 3.2 OnPush with Mutable State
- **Line:** 18 (changeDetection strategy)
- **Lines:** 159-165, 173-179
- **Issue:** Using `OnPush` strategy while mutating arrays/objects directly
- **Impact:** Change detection won't trigger properly
- **Fix:** Use immutable updates or switch to default change detection

#### 3.3 Direct DOM Manipulation
- **Line:** 195-213
- **Issue:** Using `document.getElementById()` and `createElement()`
- **Impact:** Bypasses Angular's rendering, potential memory leaks
- **Fix:** Use Angular templates and components

#### 3.4 Memory Leak - setTimeout
- **Lines:** 125-127, 209-211
- **Issue:** `setTimeout()` without cleanup
- **Impact:** Callbacks may execute after component destruction
- **Fix:** Store timeout IDs and clear in `ngOnDestroy`

#### 3.5 Performance Issue
- **Line:** 187-189
- **Issue:** Calling `detectChanges()` twice in succession
- **Impact:** Unnecessary performance overhead
- **Fix:** Remove redundant change detection calls

#### 3.6 Console.log in Production
- **Lines:** 132, 168, 182, 191
- **Issue:** `console.log()` statements throughout code
- **Impact:** Performance impact, security concerns
- **Fix:** Remove or use proper logging service

---

## 4. User Form Component

**Location:** `src/app/components/user-form/user-form.component.ts`

### Violations

#### 4.1 Memory Leak - valueChanges Subscription
- **Line:** 213-219
- **Issue:** `valueChanges` subscription without unsubscribe
- **Impact:** Memory leak, subscription persists after destruction
- **Fix:** Use `takeUntilDestroyed()` or unsubscribe in `ngOnDestroy`

#### 4.2 Memory Leak - statusChanges Subscription
- **Line:** 222-225
- **Issue:** `statusChanges` subscription without cleanup
- **Impact:** Memory leak
- **Fix:** Unsubscribe in `ngOnDestroy`

#### 4.3 Memory Leak - Multiple Control Subscriptions
- **Lines:** 228-237
- **Issue:** Individual form control subscriptions without cleanup
- **Impact:** Multiple memory leaks
- **Fix:** Unsubscribe all in `ngOnDestroy`

#### 4.4 Code Standard - No Null Checks
- **Lines:** 35, 47, 59, 305-306
- **Issue:** Accessing form controls without null checks
- **Impact:** Potential runtime errors
- **Fix:** Use optional chaining or null checks

#### 4.5 Performance - No Debounce
- **Line:** 213
- **Issue:** `valueChanges` without `debounceTime()`
- **Impact:** Fires on every keystroke, expensive operations
- **Fix:** Add `debounceTime(300)` operator

#### 4.6 Code Standard - Magic Strings
- **Line:** 207-214
- **Issue:** Using string literals instead of constants
- **Impact:** Harder to maintain, prone to typos
- **Fix:** Define form control name constants

#### 4.7 Reactive Forms - setValue Misuse
- **Line:** 287-296
- **Issue:** Using `setValue()` instead of `patchValue()`
- **Impact:** Requires all form controls, fragile
- **Fix:** Use `patchValue()` for partial updates

---

## 5. Dashboard Component

**Location:** `src/app/components/dashboard/dashboard.component.ts`

### Violations

#### 5.1 Memory Leak - Multiple Interval Subscriptions
- **Lines:** 127-133, 136-142, 145-151
- **Issue:** Three `interval()` subscriptions without cleanup
- **Impact:** Severe memory leak, continuous HTTP requests
- **Fix:** Store subscriptions and unsubscribe in `ngOnDestroy`

#### 5.2 Memory Leak - HTTP Polling
- **Lines:** 127-151
- **Issue:** HTTP requests in intervals without cleanup
- **Impact:** Network requests continue after component destruction
- **Fix:** Unsubscribe from all polling subscriptions

#### 5.3 Memory Leak - Event Listeners
- **Lines:** 175-189
- **Issue:** Multiple `fromEvent()` subscriptions without cleanup
- **Impact:** Event listeners remain active
- **Fix:** Unsubscribe all event listeners in `ngOnDestroy`

#### 5.4 Nested Subscriptions (Callback Hell)
- **Lines:** 154-167, 220-232
- **Issue:** Subscriptions nested 2-3 levels deep
- **Impact:** Hard to read, maintain, and debug
- **Fix:** Use RxJS operators like `switchMap`, `mergeMap`

#### 5.5 No Error Handling
- **Lines:** 127-167, 175-189
- **Issue:** Subscriptions without error handlers
- **Impact:** Unhandled errors crash the app
- **Fix:** Add error handling in subscribe callbacks

#### 5.6 Component Making HTTP Calls
- **Lines:** 127-232
- **Issue:** Component directly using `HttpClient`
- **Impact:** Violates separation of concerns
- **Fix:** Create service layer for HTTP operations

#### 5.7 Complex Polling Without Cleanup
- **Line:** 207-215
- **Issue:** `timer()` with `switchMap()` but no unsubscribe
- **Impact:** Memory leak
- **Fix:** Store subscription and unsubscribe

---

## 6. Modal Component

**Location:** `src/app/components/modal/modal.component.ts`

### Violations

#### 6.1 Direct DOM Manipulation - getElementById
- **Lines:** 139, 147, 157, 237, 253, 268, 280
- **Issue:** Using `document.getElementById()` throughout
- **Impact:** Bypasses Angular, potential null references
- **Fix:** Use `@ViewChild` and template references

#### 6.2 Security - innerHTML (XSS Vulnerability)
- **Lines:** 169, 197, 277
- **Issue:** Using `innerHTML` to inject content
- **Impact:** Cross-site scripting (XSS) vulnerability
- **Fix:** Use Angular templates and data binding

#### 6.3 Direct Style Manipulation
- **Lines:** 143-144, 149, 243-245, 281-282
- **Issue:** Directly manipulating element styles
- **Impact:** Bypasses Angular's rendering
- **Fix:** Use Angular's style binding or CSS classes

#### 6.4 Missing ViewChild Usage
- **Issue:** Not using `@ViewChild` decorator
- **Impact:** Improper Angular component architecture
- **Fix:** Use `@ViewChild` to access template elements

#### 6.5 Accessibility - Missing ARIA Attributes
- **Lines:** 31-38 (template)
- **Issue:** Modal missing `role`, `aria-modal`, `aria-labelledby`
- **Impact:** Not accessible to screen readers
- **Fix:** Add proper ARIA attributes

#### 6.6 Memory Leak - Event Listeners
- **Lines:** 122-126, 152
- **Issue:** Adding event listeners without removal
- **Impact:** Event listeners persist after destruction
- **Fix:** Remove listeners in `ngOnDestroy`

#### 6.7 Memory Leak - setTimeout
- **Lines:** 133, 200, 247
- **Issue:** Multiple `setTimeout()` calls without cleanup
- **Impact:** Callbacks may execute after destruction
- **Fix:** Store timeout IDs and clear in `ngOnDestroy`

#### 6.8 Missing ngOnDestroy
- **Issue:** No cleanup lifecycle hook implemented
- **Impact:** No cleanup for listeners, timers, or styles
- **Fix:** Implement `ngOnDestroy` with proper cleanup

---

## Summary Statistics

### Total Violations by Category

| Category | Count | Components Affected |
|----------|-------|---------------------|
| Memory Leaks | 25+ | All 6 components |
| Code Standards | 12 | 4 components |
| Performance Issues | 5 | 3 components |
| Security Issues | 3 | 1 component |
| Accessibility Issues | 3 | 2 components |
| Architecture Issues | 4 | 3 components |

### Severity Breakdown

- **Critical:** 15 violations (Memory leaks, Security issues)
- **High:** 18 violations (Performance, Architecture)
- **Medium:** 14 violations (Code standards, Accessibility)

### Expected Detection by Bob AI

The automated PR review system should detect and flag:

1. ✅ All memory leaks (subscriptions, timers, event listeners)
2. ✅ Direct DOM manipulation patterns
3. ✅ Security vulnerabilities (innerHTML usage)
4. ✅ Accessibility violations
5. ✅ Architectural drift (fetch() usage, HTTP in components)
6. ✅ Code standard violations (any types, magic strings)
7. ✅ Performance anti-patterns (template methods, no debounce)
8. ✅ Missing lifecycle hooks (ngOnDestroy)

---

## Testing the PR Governance System

To test the automated review:

1. Create a new branch
2. Commit one or more flawed components
3. Open a pull request
4. Bob AI should automatically review and comment on violations
5. Verify that all intentional flaws are detected

## Notes

- All TypeScript errors in the user-form component are **intentional** to demonstrate null check violations
- The application may have runtime errors due to intentional flaws
- This is for **demonstration purposes only** - never use these patterns in production code

---

**Last Updated:** 2026-05-22  
**Components:** 6  
**Total Violations:** 52+  
**Purpose:** PR Governance Demo & Training
