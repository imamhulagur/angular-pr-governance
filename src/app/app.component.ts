import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Angular PR Governance Demo</h1>
        <p>Demonstrating Automated Code Review with Bob AI</p>
      </header>
      
      <main>
        <app-user-profile></app-user-profile>
      </main>
      
      <footer>
        <p>This application contains intentional code violations for demonstration purposes.</p>
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
      margin: 0;
      opacity: 0.9;
    }
    
    main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }
    
    footer {
      background: #333;
      color: white;
      padding: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    
    footer p {
      margin: 0;
    }
  `]
})
export class AppComponent {
  title = 'angular-pr-governance-demo';
}

// Made with Bob
