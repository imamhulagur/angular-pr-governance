# Angular Coding Standards & Best Practices

This document defines the coding standards and best practices for Angular development in this project.

## 📚 Table of Contents

1. [General Principles](#general-principles)
2. [Project Structure](#project-structure)
3. [Naming Conventions](#naming-conventions)
4. [Components](#components)
5. [Services](#services)
6. [Modules](#modules)
7. [Templates](#templates)
8. [Styling](#styling)
9. [TypeScript](#typescript)
10. [RxJS & Observables](#rxjs--observables)
11. [Forms](#forms)
12. [Testing](#testing)
13. [Performance](#performance)
14. [Security](#security)
15. [Accessibility](#accessibility)

---

## 🎯 General Principles

### SOLID Principles
- **S**ingle Responsibility: Each class/component should have one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Derived classes must be substitutable for base classes
- **I**nterface Segregation: Many specific interfaces are better than one general
- **D**ependency Inversion: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Extract common logic into services/utilities
- Create reusable components
- Use shared modules for common functionality

### KISS (Keep It Simple, Stupid)
- Write simple, readable code
- Avoid over-engineering
- Prefer clarity over cleverness

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── core.module.ts
│   │
│   ├── shared/                  # Reusable components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── models/
│   │   └── shared.module.ts
│   │
│   ├── features/                # Feature modules
│   │   ├── feature-a/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── feature-a-routing.module.ts
│   │   │   └── feature-a.module.ts
│   │   └── feature-b/
│   │
│   ├── layout/                  # Layout components
│   │   ├── header/
│   │   ├── footer/
│   │   └── sidebar/
│   │
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets/                      # Static assets
├── environments/                # Environment configurations
└── styles/                      # Global styles
```

---

## 🏷️ Naming Conventions

### Files
```typescript
// Components
user-profile.component.ts
user-profile.component.html
user-profile.component.scss
user-profile.component.spec.ts

// Services
user.service.ts
user.service.spec.ts

// Modules
user.module.ts
user-routing.module.ts

// Directives
highlight.directive.ts

// Pipes
currency-format.pipe.ts

// Guards
auth.guard.ts

// Interceptors
auth.interceptor.ts

// Models/Interfaces
user.model.ts
user.interface.ts

// Enums
user-role.enum.ts

// Constants
api-endpoints.constants.ts
```

### Classes & Interfaces
```typescript
// Classes: PascalCase
export class UserProfileComponent { }
export class UserService { }

// Interfaces: PascalCase with 'I' prefix (optional)
export interface User { }
export interface IUserProfile { }

// Enums: PascalCase
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

// Types: PascalCase
export type UserId = string;
```

### Variables & Functions
```typescript
// Variables: camelCase
const userName = 'John';
let isActive = true;

// Functions: camelCase, verb-based
function getUserById(id: string): User { }
function calculateTotal(items: Item[]): number { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Private members: prefix with underscore (optional)
private _internalState: any;
```

### Component Selectors
```typescript
// Use kebab-case with app prefix
@Component({
  selector: 'app-user-profile',  // ✅ Good
  // selector: 'userProfile',    // ❌ Bad
  // selector: 'UserProfile',    // ❌ Bad
})
```

---

## 🧩 Components

### Component Structure
```typescript
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅ Use OnPush when possible
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // 1. Inputs
  @Input() userId!: string;
  
  // 2. Outputs
  @Output() userUpdated = new EventEmitter<User>();
  
  // 3. Public properties
  user: User | null = null;
  isLoading = false;
  
  // 4. Private properties
  private destroy$ = new Subject<void>();
  
  // 5. Constructor (inject dependencies)
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  
  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.loadUser();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 7. Public methods
  loadUser(): void {
    this.isLoading = true;
    this.userService.getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
  
  // 8. Private methods
  private validateUser(user: User): boolean {
    return !!user.email && !!user.name;
  }
}
```

### Component Best Practices

#### ✅ DO
```typescript
// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Keep components small (< 400 lines)
// Single responsibility
// Use smart/dumb component pattern
// Unsubscribe from observables
// Use trackBy with *ngFor
```

#### ❌ DON'T
```typescript
// Don't manipulate DOM directly
// Don't use ElementRef unless absolutely necessary
// Don't subscribe in templates (use async pipe)
// Don't put business logic in components
// Don't use any type
```

---

## 🔧 Services

### Service Structure
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'  // ✅ Singleton service
})
export class UserService {
  private readonly API_URL = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  
  // Expose as observable
  public users$ = this.usersSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(
      retry(3),
      map(users => this.transformUsers(users)),
      catchError(this.handleError)
    );
  }
  
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user).pipe(
      catchError(this.handleError)
    );
  }
  
  private transformUsers(users: User[]): User[] {
    return users.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    }));
  }
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

### Service Best Practices

#### ✅ DO
```typescript
// Provide in root for singletons
@Injectable({ providedIn: 'root' })

// Use HttpClient for API calls
// Handle errors properly
// Use RxJS operators
// Return observables, not promises
// Keep services focused (single responsibility)
```

#### ❌ DON'T
```typescript
// Don't subscribe in services (return observables)
// Don't store component state in services
// Don't use services for component logic
```

---

## 📦 Modules

### Module Structure
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Feature components
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

// Feature services
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UserListComponent },
      { path: ':id', component: UserDetailComponent }
    ])
  ],
  providers: [
    UserService  // Feature-level service
  ]
})
export class UserModule { }
```

### Module Types

#### Core Module (Singleton)
```typescript
@NgModule({
  providers: [
    AuthService,
    LoggerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only');
    }
  }
}
```

#### Shared Module (Reusable)
```typescript
@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    HighlightDirective,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Export everything that other modules need
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    HighlightDirective,
    TruncatePipe
  ]
})
export class SharedModule { }
```

---

## 🎨 Templates

### Template Best Practices

#### ✅ DO
```html
<!-- Use async pipe for observables -->
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>

<!-- Use trackBy with *ngFor -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

<!-- Keep templates simple -->
<button (click)="onSave()">Save</button>

<!-- Use ng-container for structural directives -->
<ng-container *ngIf="isLoading">
  <app-loading-spinner></app-loading-spinner>
</ng-container>

<!-- Use proper event binding -->
<input [value]="name" (input)="onNameChange($event)">
```

#### ❌ DON'T
```html
<!-- Don't put complex logic in templates -->
<div>{{ calculateComplexValue(data) }}</div>  <!-- ❌ -->

<!-- Don't subscribe in templates -->
<div>{{ observable.subscribe() }}</div>  <!-- ❌ -->

<!-- Don't use function calls in templates -->
<div *ngFor="let item of getItems()">  <!-- ❌ -->
```

---

## 🎨 Styling

### Component Styles
```scss
// Use :host for component root
:host {
  display: block;
  padding: 1rem;
}

// Use :host-context for theming
:host-context(.dark-theme) {
  background-color: #333;
  color: #fff;
}

// Use BEM naming convention
.user-profile {
  &__header {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  &__content {
    margin-top: 1rem;
  }
  
  &--highlighted {
    background-color: yellow;
  }
}
```

---

## 📘 TypeScript

### Type Safety
```typescript
// ✅ Use strong typing
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ✅ Use union types
type Status = 'pending' | 'active' | 'inactive';

// ✅ Use generics
function getById<T>(id: string, items: T[]): T | undefined {
  return items.find(item => (item as any).id === id);
}

// ❌ Avoid any
const data: any = {};  // ❌ Bad
const data: unknown = {};  // ✅ Better
```

---

## 🔄 RxJS & Observables

### Observable Best Practices
```typescript
// ✅ Use operators
this.userService.getUsers().pipe(
  map(users => users.filter(u => u.active)),
  catchError(error => of([])),
  takeUntil(this.destroy$)
).subscribe();

// ✅ Unsubscribe properly
private destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// ✅ Use async pipe in templates
user$ = this.userService.getUser(id);
```

---

## 📝 Forms

### Reactive Forms
```typescript
// ✅ Use FormBuilder
this.userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  age: [null, [Validators.min(18), Validators.max(100)]]
});

// ✅ Handle form submission
onSubmit(): void {
  if (this.userForm.valid) {
    const user = this.userForm.value;
    this.userService.createUser(user).subscribe();
  }
}
```

---

## 🧪 Testing

### Unit Test Structure
```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load user on init', () => {
    const mockUser = { id: '1', name: 'John' };
    userService.getUser.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(userService.getUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });
});
```

---

## ⚡ Performance

### Performance Checklist
- ✅ Use OnPush change detection
- ✅ Use trackBy with *ngFor
- ✅ Lazy load feature modules
- ✅ Use virtual scrolling for large lists
- ✅ Optimize images
- ✅ Use Web Workers for heavy computations
- ✅ Implement proper caching strategies
- ✅ Minimize bundle size

---

## 🔒 Security

### Security Checklist
- ✅ Sanitize user inputs
- ✅ Use HttpClient (built-in XSS protection)
- ✅ Implement CSRF protection
- ✅ Validate on both client and server
- ✅ Use environment variables for secrets
- ✅ Keep dependencies updated
- ✅ Implement proper authentication/authorization

---

## ♿ Accessibility

### Accessibility Checklist
- ✅ Use semantic HTML
- ✅ Add ARIA labels where needed
- ✅ Ensure keyboard navigation
- ✅ Maintain proper color contrast
- ✅ Provide alt text for images
- ✅ Test with screen readers
- ✅ Support focus management

---

## 📚 Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Best Practices](https://angular.io/guide/best-practices)
- [RxJS Best Practices](https://rxjs.dev/guide/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Last Updated**: 2026-05-21
**Version**: 1.0.0