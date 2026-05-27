import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, timer, fromEvent, merge } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains MULTIPLE intentional violations:
 * 
 * 1. MEMORY LEAK: Multiple interval/timer subscriptions without cleanup
 * 2. MEMORY LEAK: HTTP requests in intervals without unsubscribe
 * 3. MEMORY LEAK: Event listeners without cleanup
 * 4. CODE STANDARD: Nested subscriptions (callback hell)
 * 5. CODE STANDARD: No error handling in subscriptions
 * 6. PERFORMANCE: Polling without proper cleanup
 * 7. ARCHITECTURE: Component making HTTP calls directly
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Analytics Dashboard</h2>
      
      <div class="dashboard-grid">
        <div class="card">
          <h3>Active Users</h3>
          <div class="metric">{{ activeUsers }}</div>
          <small>Updated: {{ lastUserUpdate }}</small>
        </div>
        
        <div class="card">
          <h3>Total Sales</h3>
          <div class="metric">\${{ totalSales | number:'1.2-2' }}</div>
          <small>Updated: {{ lastSalesUpdate }}</small>
        </div>
        
        <div class="card">
          <h3>Server Status</h3>
          <div class="metric" [class.online]="serverStatus === 'online'" 
               [class.offline]="serverStatus === 'offline'">
            {{ serverStatus }}
          </div>
          <small>Updated: {{ lastStatusUpdate }}</small>
        </div>
        
        <div class="card">
          <h3>Notifications</h3>
          <div class="metric">{{ notificationCount }}</div>
          <small>Updated: {{ lastNotificationUpdate }}</small>
        </div>
      </div>
      
      <div class="activity-log">
        <h3>Recent Activity</h3>
        <div class="log-entries">
          <div *ngFor="let log of activityLogs" class="log-entry">
            <span class="timestamp">{{ log.timestamp }}</span>
            <span class="message">{{ log.message }}</span>
          </div>
        </div>
      </div>
      
      <div class="stats">
        <p>Mouse Position: X={{ mouseX }}, Y={{ mouseY }}</p>
        <p>Window Size: {{ windowWidth }}x{{ windowHeight }}</p>
        <p>Scroll Position: {{ scrollY }}</p>
        <p>API Calls Made: {{ apiCallCount }}</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }
    
    .metric {
      font-size: 32px;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 10px;
    }
    
    .metric.online {
      color: #4caf50;
    }
    
    .metric.offline {
      color: #f44336;
    }
    
    .card small {
      color: #666;
      font-size: 12px;
    }
    
    .activity-log {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .activity-log h3 {
      margin: 0 0 15px 0;
    }
    
    .log-entries {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .log-entry {
      padding: 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      gap: 15px;
    }
    
    .log-entry:last-child {
      border-bottom: none;
    }
    
    .timestamp {
      color: #666;
      font-size: 12px;
      min-width: 80px;
    }
    
    .message {
      flex: 1;
    }
    
    .stats {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
    }
    
    .stats p {
      margin: 5px 0;
      font-family: monospace;
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeUsers: number = 0;
  totalSales: number = 0;
  serverStatus: string = 'checking...';
  notificationCount: number = 0;
  
  lastUserUpdate: string = '';
  lastSalesUpdate: string = '';
  lastStatusUpdate: string = '';
  lastNotificationUpdate: string = '';
  
  activityLogs: any[] = [];
  
  mouseX: number = 0;
  mouseY: number = 0;
  windowWidth: number = 0;
  windowHeight: number = 0;
  scrollY: number = 0;
  
  apiCallCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startPolling();
    this.setupEventListeners();
    this.startTimers();
    this.loadInitialData();
  }

  // ❌ VIOLATION: Missing ngOnDestroy - no cleanup for ANY subscriptions!

  private startPolling(): void {
    // ❌ VIOLATION 1 & 2: Interval with HTTP calls, no unsubscribe
    interval(3000).subscribe(() => {
      this.apiCallCount++;
      // ❌ VIOLATION 7: Component making HTTP calls directly
      this.http.get<any>('https://api.example.com/users/count').subscribe(data => {
        this.activeUsers = data.count;
        this.lastUserUpdate = new Date().toLocaleTimeString();
      });
    });

    // ❌ VIOLATION 1 & 2: Another polling interval without cleanup
    interval(5000).subscribe(() => {
      this.apiCallCount++;
      this.http.get<any>('https://api.example.com/sales/total').subscribe(data => {
        this.totalSales = data.total;
        this.lastSalesUpdate = new Date().toLocaleTimeString();
      });
    });

    // ❌ VIOLATION 1 & 2: Yet another interval
    interval(2000).subscribe(() => {
      this.apiCallCount++;
      this.http.get<any>('https://api.example.com/server/status').subscribe(data => {
        this.serverStatus = data.status;
        this.lastStatusUpdate = new Date().toLocaleTimeString();
      });
    });

    // ❌ VIOLATION 4: Nested subscriptions (callback hell)
    interval(10000).subscribe(() => {
      this.http.get<any>('https://api.example.com/notifications').subscribe(data => {
        this.notificationCount = data.count;
        this.lastNotificationUpdate = new Date().toLocaleTimeString();
        
        // Nested subscription!
        this.http.get<any>('https://api.example.com/notifications/latest').subscribe(latest => {
          this.addActivityLog(`New notification: ${latest.message}`);
          
          // Triple nested!
          if (latest.urgent) {
            this.http.post('https://api.example.com/alerts', { message: latest.message }).subscribe(() => {
              console.log('Alert sent');
            });
          }
        });
      });
    });
  }

  private setupEventListeners(): void {
    // ❌ VIOLATION 3: fromEvent subscriptions without cleanup
    fromEvent(document, 'mousemove').subscribe((event: any) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    fromEvent(window, 'resize').subscribe(() => {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });

    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollY = window.scrollY;
    });

    // ❌ VIOLATION 3: Multiple event listeners
    fromEvent(document, 'click').subscribe(() => {
      this.addActivityLog('User clicked somewhere');
    });

    fromEvent(document, 'keypress').subscribe((event: any) => {
      this.addActivityLog(`Key pressed: ${event.key}`);
    });
  }

  private startTimers(): void {
    // ❌ VIOLATION 1: timer subscription without cleanup
    timer(0, 1000).subscribe(() => {
      // Update something every second
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    });

    // ❌ VIOLATION 1: Another timer
    timer(5000, 15000).subscribe(() => {
      this.addActivityLog('Periodic check completed');
    });

    // ❌ VIOLATION 6: Complex polling logic without cleanup
    timer(0, 7000).pipe(
      switchMap(() => this.http.get<any>('https://api.example.com/health'))
    ).subscribe(
      data => {
        this.apiCallCount++;
        console.log('Health check:', data);
      },
      // ❌ VIOLATION 5: Empty error handler
      error => {}
    );
  }

  private loadInitialData(): void {
    // ❌ VIOLATION 4: More nested subscriptions
    this.http.get<any>('https://api.example.com/dashboard/init').subscribe(data => {
      this.activeUsers = data.users;
      this.totalSales = data.sales;
      
      // Nested!
      this.http.get<any>('https://api.example.com/logs/recent').subscribe(logs => {
        this.activityLogs = logs;
        
        // Triple nested!
        logs.forEach((log: any) => {
          this.http.get<any>(`https://api.example.com/logs/${log.id}/details`).subscribe(details => {
            console.log('Log details:', details);
          });
        });
      });
    });

    // ❌ VIOLATION 5: Subscription with no error handling at all
    this.http.get<any>('https://api.example.com/config').subscribe(config => {
      console.log('Config loaded:', config);
    });
  }

  private addActivityLog(message: string): void {
    this.activityLogs.unshift({
      timestamp: new Date().toLocaleTimeString(),
      message: message
    });

    // Keep only last 50 logs
    if (this.activityLogs.length > 50) {
      this.activityLogs = this.activityLogs.slice(0, 50);
    }
  }

  // ❌ VIOLATION: No cleanup methods at all!
  // Should have ngOnDestroy with proper subscription management
}

// Made with Bob