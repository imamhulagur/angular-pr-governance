import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { NotificationComponent } from './components/notification/notification.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UserProfileComponent,
    DataTableComponent,
    NotificationComponent,
    UserFormComponent,
    DashboardComponent,
    ModalComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>Angular PR Governance Demo</h1>
        <p>Demonstrating Automated Code Review with Bob AI</p>
        <p class="warning">⚠️ This application contains intentional code violations for demonstration purposes</p>
      </header>
      
      <nav class="component-nav">
        <button
          *ngFor="let component of components"
          (click)="activeComponent = component.id"
          [class.active]="activeComponent === component.id">
          {{ component.name }}
        </button>
      </nav>
      
      <main>
        <div class="component-info">
          <h3>{{ getCurrentComponent()?.name }}</h3>
          <p>{{ getCurrentComponent()?.description }}</p>
        </div>
        
        <app-user-profile *ngIf="activeComponent === 'user-profile'"></app-user-profile>
        <app-data-table *ngIf="activeComponent === 'data-table'"></app-data-table>
        <app-notification *ngIf="activeComponent === 'notification'"></app-notification>
        <app-user-form *ngIf="activeComponent === 'user-form'"></app-user-form>
        <app-dashboard *ngIf="activeComponent === 'dashboard'"></app-dashboard>
        
        <div *ngIf="activeComponent === 'modal'" class="modal-demo">
          <button (click)="showModal = true">Open Modal</button>
          <app-modal
            [isOpen]="showModal"
            [title]="'Demo Modal'"
            (closed)="showModal = false"
            (confirmed)="onModalConfirm()">
            <p>This is a modal with intentional DOM manipulation issues.</p>
            <p>Check the component code for violations!</p>
          </app-modal>
        </div>
      </main>
      
      <footer>
        <p>Angular PR Governance Demo - Automated Code Review System</p>
        <p>Components: {{ components.length }} | Active: {{ getCurrentComponent()?.name }}</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }
    
    header p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
    }
    
    header .warning {
      background: rgba(255, 152, 0, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      display: inline-block;
    }
    
    .component-nav {
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .component-nav button {
      padding: 0.75rem 1.5rem;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .component-nav button:hover {
      background: #f0f0f0;
    }
    
    .component-nav button.active {
      background: #667eea;
      color: white;
    }
    
    .component-info {
      background: white;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .component-info h3 {
      margin: 0 0 0.5rem 0;
      color: #667eea;
    }
    
    .component-info p {
      margin: 0;
      color: #666;
    }
    
    main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }
    
    .modal-demo {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .modal-demo button {
      padding: 1rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    footer {
      background: #333;
      color: white;
      padding: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    
    footer p {
      margin: 0.25rem 0;
    }
  `]
})
export class AppComponent {
  title = 'angular-pr-governance-demo';
  activeComponent: string = 'user-profile';
  showModal: boolean = false;
  
  components = [
    {
      id: 'user-profile',
      name: 'User Profile',
      description: 'Memory leak: interval subscription without cleanup, architectural drift: raw fetch() calls, accessibility issues'
    },
    {
      id: 'data-table',
      name: 'Data Table',
      description: 'Memory leaks: EventEmitter, fromEvent, setInterval without cleanup, using "any" type, inefficient template methods'
    },
    {
      id: 'notification',
      name: 'Notifications',
      description: 'Improper change detection: manual detectChanges() calls, OnPush with mutable state, direct DOM manipulation'
    },
    {
      id: 'user-form',
      name: 'User Form',
      description: 'Reactive forms anti-patterns: valueChanges without unsubscribe, no null checks, setValue misuse, no debounce'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Multiple memory leaks: interval, timer, HTTP polling, event listeners without cleanup, nested subscriptions'
    },
    {
      id: 'modal',
      name: 'Modal',
      description: 'DOM manipulation anti-patterns: getElementById, innerHTML (XSS risk), direct style manipulation, missing ARIA'
    }
  ];
  
  getCurrentComponent() {
    return this.components.find(c => c.id === this.activeComponent);
  }
  
  onModalConfirm(): void {
    alert('Modal confirmed!');
  }
}

// Made with Bob
