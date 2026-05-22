import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains MULTIPLE intentional violations:
 * 
 * 1. REACTIVE FORMS: Not unsubscribing from valueChanges
 * 2. REACTIVE FORMS: Using setValue incorrectly
 * 3. CODE STANDARD: No form validation error handling
 * 4. CODE STANDARD: Accessing form controls without null checks
 * 5. PERFORMANCE: Subscribing to valueChanges without debounce
 * 6. CODE STANDARD: Magic strings instead of constants
 * 7. MEMORY LEAK: statusChanges subscription without cleanup
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>User Registration Form</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            id="username" 
            type="text" 
            formControlName="username"
            placeholder="Enter username">
          <!-- ❌ VIOLATION 4: Should use proper null checks (fixed for build) -->
          <div class="error" *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched">
            Username is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email"
            placeholder="Enter email">
          <div class="error" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
            Valid email is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password"
            placeholder="Enter password">
          <div class="error" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
            Password must be at least 8 characters
          </div>
        </div>
        
        <div class="form-group">
          <label for="age">Age:</label>
          <input 
            id="age" 
            type="number" 
            formControlName="age"
            placeholder="Enter age">
        </div>
        
        <div class="form-group">
          <label for="country">Country:</label>
          <select id="country" formControlName="country">
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="IN">India</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" formControlName="agreeToTerms">
            I agree to the terms and conditions
          </label>
        </div>
        
        <div class="form-actions">
          <button type="submit" [disabled]="userForm.invalid">Submit</button>
          <button type="button" (click)="resetForm()">Reset</button>
          <button type="button" (click)="fillDemoData()">Fill Demo Data</button>
        </div>
      </form>
      
      <div class="form-debug">
        <h3>Form Debug Info</h3>
        <p>Form Valid: {{ userForm.valid }}</p>
        <p>Form Dirty: {{ userForm.dirty }}</p>
        <p>Form Touched: {{ userForm.touched }}</p>
        <p>Value Changes Count: {{ valueChangesCount }}</p>
        <p>Status Changes Count: {{ statusChangesCount }}</p>
      </div>
      
      <div class="form-value">
        <h3>Current Form Value:</h3>
        <pre>{{ userForm.value | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="password"],
    .form-group input[type="number"],
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    .form-group input[type="checkbox"] {
      margin-right: 8px;
    }
    
    .error {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .form-actions button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .form-actions button[type="submit"] {
      background-color: #4caf50;
      color: white;
    }
    
    .form-actions button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .form-actions button[type="button"] {
      background-color: #2196F3;
      color: white;
    }
    
    .form-debug,
    .form-value {
      margin-top: 30px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .form-debug h3,
    .form-value h3 {
      margin-top: 0;
    }
    
    pre {
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  valueChangesCount: number = 0;
  statusChangesCount: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormListeners();
  }

  // Missing ngOnDestroy - no cleanup for subscriptions!

  private initializeForm(): void {
    // ❌ VIOLATION 6: Using magic strings instead of constants
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: [''],
      country: [''],
      agreeToTerms: [false]
    });
  }

  private setupFormListeners(): void {
    // ❌ VIOLATION 1: valueChanges subscription without unsubscribe
    // ❌ VIOLATION 5: No debounceTime - fires on every keystroke
    this.userForm.valueChanges.subscribe(value => {
      this.valueChangesCount++;
      console.log('Form value changed:', value);
      
      // ❌ VIOLATION 5: Expensive operation on every change
      this.validateFormData(value);
    });

    // ❌ VIOLATION 7: statusChanges subscription without cleanup
    this.userForm.statusChanges.subscribe(status => {
      this.statusChangesCount++;
      console.log('Form status changed:', status);
    });

    // ❌ VIOLATION 1: Individual control subscriptions without cleanup
    this.userForm.get('username')?.valueChanges.subscribe(value => {
      console.log('Username changed:', value);
    });

    this.userForm.get('email')?.valueChanges.subscribe(value => {
      console.log('Email changed:', value);
    });

    this.userForm.get('password')?.valueChanges.subscribe(value => {
      console.log('Password changed:', value);
    });
  }

  private validateFormData(value: any): void {
    // Simulating expensive validation
    const keys = Object.keys(value);
    keys.forEach(key => {
      // Unnecessary processing
      const val = value[key];
      if (val && typeof val === 'string') {
        val.trim();
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      alert('Form submitted successfully!');
    } else {
      // ❌ VIOLATION 3: Poor error handling
      alert('Form is invalid!');
    }
  }

  resetForm(): void {
    // ❌ VIOLATION 2: Using reset without proper options
    // This can cause issues with pristine/touched states
    this.userForm.reset();
  }

  fillDemoData(): void {
    // ❌ VIOLATION 2: Using setValue incorrectly
    // setValue requires ALL form controls to be provided
    // Should use patchValue for partial updates
    try {
      this.userForm.setValue({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        age: 30,
        country: 'US',
        agreeToTerms: true
      });
    } catch (error) {
      console.error('Error setting form value:', error);
    }

    // ❌ VIOLATION 4: Should avoid optional chaining everywhere (fixed for build)
    this.userForm.get('username')?.markAsTouched();
    this.userForm.get('email')?.markAsTouched();
  }

  // ❌ VIOLATION 3: No proper validation error messages
  // Should have a method to get specific error messages
  getErrorMessage(controlName: string): string {
    return 'Invalid input';
  }
}

// Made with Bob