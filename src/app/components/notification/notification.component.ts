import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains MULTIPLE intentional violations:
 * 
 * 1. CHANGE DETECTION: Manual detectChanges() calls everywhere (anti-pattern)
 * 2. CHANGE DETECTION: OnPush strategy with mutable state changes
 * 3. CODE STANDARD: Direct DOM manipulation instead of Angular approach
 * 4. MEMORY LEAK: setTimeout without cleanup
 * 5. PERFORMANCE: Unnecessary change detection triggers
 * 6. CODE STANDARD: Using console.log in production code
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  // ❌ VIOLATION 2: Using OnPush with mutable object mutations
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="notification-container">
      <h2>Notification Center</h2>
      
      <div class="notification-controls">
        <button (click)="addNotification()">Add Notification</button>
        <button (click)="clearAll()">Clear All</button>
        <button (click)="updateCounter()">Update Counter</button>
      </div>
      
      <div class="counter">
        Total Notifications: {{ notificationCount }}
      </div>
      
      <div class="notifications-list">
        <div 
          *ngFor="let notification of notifications; trackBy: trackByIndex"
          class="notification-item"
          [class.error]="notification.type === 'error'"
          [class.warning]="notification.type === 'warning'"
          [class.success]="notification.type === 'success'">
          <span class="notification-icon">{{ getIcon(notification.type) }}</span>
          <div class="notification-content">
            <strong>{{ notification.title }}</strong>
            <p>{{ notification.message }}</p>
            <small>{{ notification.timestamp }}</small>
          </div>
          <button (click)="removeNotification(notification.id)" class="close-btn">×</button>
        </div>
      </div>
      
      <div id="toast-container"></div>
    </div>
  `,
  styles: [`
    .notification-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .notification-controls {
      margin-bottom: 20px;
    }
    
    .notification-controls button {
      margin-right: 10px;
      padding: 10px 20px;
      cursor: pointer;
    }
    
    .counter {
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 4px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 15px;
      border-radius: 8px;
      background-color: #f5f5f5;
      border-left: 4px solid #2196F3;
    }
    
    .notification-item.error {
      border-left-color: #f44336;
      background-color: #ffebee;
    }
    
    .notification-item.warning {
      border-left-color: #ff9800;
      background-color: #fff3e0;
    }
    
    .notification-item.success {
      border-left-color: #4caf50;
      background-color: #e8f5e9;
    }
    
    .notification-icon {
      font-size: 24px;
      margin-right: 15px;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-content strong {
      display: block;
      margin-bottom: 5px;
    }
    
    .notification-content p {
      margin: 5px 0;
    }
    
    .notification-content small {
      color: #666;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0 5px;
    }
    
    .close-btn:hover {
      color: #333;
    }
    
    #toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  notificationCount: number = 0;
  private nextId: number = 1;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadInitialNotifications();
    
    // ❌ VIOLATION 4: setTimeout without cleanup (memory leak)
    setTimeout(() => {
      this.addNotification();
    }, 3000);
    
    // ❌ VIOLATION 6: Console.log in production code
    console.log('NotificationComponent initialized');
  }

  loadInitialNotifications(): void {
    this.notifications = [
      {
        id: this.nextId++,
        type: 'success',
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: this.nextId++,
        type: 'warning',
        title: 'Update Available',
        message: 'A new version of the app is available.',
        timestamp: new Date().toLocaleTimeString()
      }
    ];
    
    this.notificationCount = this.notifications.length;
    
    // ❌ VIOLATION 1: Manual detectChanges() call (anti-pattern)
    // With OnPush, this is sometimes needed, but overusing it is a code smell
    this.cdr.detectChanges();
  }

  addNotification(): void {
    const types = ['success', 'error', 'warning', 'info'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // ❌ VIOLATION 2: Mutating array directly with OnPush strategy
    // This won't trigger change detection properly with OnPush
    this.notifications.push({
      id: this.nextId++,
      type: randomType,
      title: `Notification ${this.nextId}`,
      message: `This is a ${randomType} notification message.`,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // ❌ VIOLATION 2: Mutating property directly
    this.notificationCount++;
    
    // ❌ VIOLATION 1: Forced manual change detection
    this.cdr.detectChanges();
    
    // ❌ VIOLATION 3: Direct DOM manipulation
    this.showToast(`New ${randomType} notification added!`);
    
    // ❌ VIOLATION 6: Console.log everywhere
    console.log('Notification added:', this.notifications[this.notifications.length - 1]);
  }

  removeNotification(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      // ❌ VIOLATION 2: Mutating array with splice
      this.notifications.splice(index, 1);
      this.notificationCount--;
      
      // ❌ VIOLATION 1: Manual change detection again
      this.cdr.detectChanges();
      
      console.log('Notification removed:', id);
    }
  }

  clearAll(): void {
    // ❌ VIOLATION 2: Reassigning array reference but still problematic pattern
    this.notifications = [];
    this.notificationCount = 0;
    
    // ❌ VIOLATION 1: Yet another manual detectChanges
    this.cdr.detectChanges();
    
    // ❌ VIOLATION 3: Direct DOM manipulation
    this.showToast('All notifications cleared!');
  }

  updateCounter(): void {
    // ❌ VIOLATION 5: Unnecessary change detection trigger
    // This method does nothing useful but forces change detection
    this.notificationCount = this.notifications.length;
    this.cdr.detectChanges();
    this.cdr.detectChanges(); // Double detection! Even worse!
    
    console.log('Counter updated:', this.notificationCount);
  }

  // ❌ VIOLATION 3: Direct DOM manipulation instead of using Angular approach
  private showToast(message: string): void {
    const container = document.getElementById('toast-container');
    if (container) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        background: #323232;
        color: white;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 10px;
        animation: slideIn 0.3s ease-out;
      `;
      
      container.appendChild(toast);
      
      // ❌ VIOLATION 4: Another setTimeout without cleanup
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  }

  getIcon(type: string): string {
    const icons: any = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || 'ℹ';
  }

  // ❌ VIOLATION 5: Using index as trackBy (not terrible but not optimal)
  trackByIndex(index: number): number {
    return index;
  }
}

// Made with Bob