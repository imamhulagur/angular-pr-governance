import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { UserService, UserProfile } from '../../services/user.service';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains THREE intentional violations:
 * 
 * 1. MEMORY LEAK: Subscribes to interval() in ngOnInit() without cleanup
 * 2. ARCHITECTURAL DRIFT: Uses raw fetch() instead of UserService
 * 3. ACCESSIBILITY: Uses non-semantic <div> as button without ARIA attributes
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile-container">
      <h2>User Profile Management</h2>
      
      <div class="profile-card" *ngIf="currentUser">
        <img [src]="currentUser.avatar" [alt]="currentUser.name">
        <h3>{{ currentUser.name }}</h3>
        <p>{{ currentUser.email }}</p>
        <p>Role: {{ currentUser.role }}</p>
        <p>Department: {{ currentUser.department }}</p>
        
        <!-- ❌ VIOLATION 3: Accessibility Issue -->
        <!-- This div acts as a button but has no semantic meaning -->
        <!-- Missing: role="button", tabindex="0", aria-label -->
        <div class="save-button" (click)="saveProfile()">
          Save Changes
        </div>
      </div>
      
      <div class="status-message" *ngIf="statusMessage">
        {{ statusMessage }}
      </div>
      
      <div class="timer">
        Auto-refresh in: {{ countdown }} seconds
      </div>
    </div>
  `,
  styles: [`
    .user-profile-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .profile-card img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    
    .save-button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-block;
      margin-top: 10px;
    }
    
    .save-button:hover {
      background-color: #0056b3;
    }
    
    .status-message {
      padding: 10px;
      margin: 10px 0;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
    }
    
    .timer {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  currentUser: UserProfile | null = null;
  statusMessage: string = '';
  countdown: number = 30;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load initial user data properly through service
    this.userService.getUserProfile(1).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });

    // ❌ VIOLATION 1: Memory Leak - No unsubscribe or takeUntilDestroyed()
    // This interval will continue running even after component is destroyed
    interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdown = 30;
        this.refreshUserData();
      }
    });
  }

  // Note: ngOnDestroy is missing - no cleanup for the interval subscription!
  // In Angular 16+, we should use takeUntilDestroyed() or implement ngOnDestroy

  /**
   * ❌ VIOLATION 2: Architectural Drift
   * This method bypasses the UserService and makes a direct fetch() call
   * Components should NEVER make direct HTTP requests
   */
  saveProfile(): void {
    if (!this.currentUser) return;

    // WRONG: Using raw fetch() instead of UserService.updateUserProfile()
    fetch(`https://api.example.com/users/${this.currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.currentUser)
    })
    .then(response => response.json())
    .then(data => {
      this.statusMessage = 'Profile saved successfully!';
      setTimeout(() => this.statusMessage = '', 3000);
    })
    .catch(error => {
      console.error('Error saving profile:', error);
      this.statusMessage = 'Error saving profile';
    });
  }

  private refreshUserData(): void {
    // This one is correct - using the service
    this.userService.getUserProfile(1).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error refreshing user:', error);
      }
    });
  }
}

// Made with Bob
