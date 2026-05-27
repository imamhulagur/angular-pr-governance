import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fromEvent, interval } from 'rxjs';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains MULTIPLE intentional violations:
 * 
 * 1. MEMORY LEAK: EventEmitter subscriptions without cleanup
 * 2. MEMORY LEAK: fromEvent() listener not unsubscribed
 * 3. MEMORY LEAK: setInterval without clearInterval
 * 4. CODE STANDARD: Using 'any' type instead of proper typing
 * 5. CODE STANDARD: Missing OnDestroy implementation
 * 6. PERFORMANCE: Inefficient array operations in template
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-container">
      <h2>Data Table Component</h2>
      
      <div class="controls">
        <button (click)="loadData()">Load Data</button>
        <button (click)="sortData()">Sort Data</button>
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search...">
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- ❌ VIOLATION 6: Inefficient filtering in template -->
          <tr *ngFor="let item of filterData(tableData)">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button (click)="editItem(item)">Edit</button>
              <button (click)="deleteItem(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        Total Items: {{ tableData.length }} | Last Update: {{ lastUpdate }}
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      padding: 20px;
    }
    
    .controls {
      margin-bottom: 20px;
    }
    
    .controls button,
    .controls input {
      margin-right: 10px;
      padding: 8px 16px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    tr:hover {
      background-color: #f5f5f5;
    }
    
    button {
      padding: 6px 12px;
      margin-right: 5px;
      cursor: pointer;
    }
    
    .footer {
      margin-top: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
    }
  `]
})
export class DataTableComponent implements OnInit {
  // ❌ VIOLATION 4: Using 'any' type instead of proper interface
  tableData: any[] = [];
  searchTerm: string = '';
  lastUpdate: string = '';
  
  // ❌ VIOLATION 1: EventEmitter that will be subscribed to but never cleaned up
  @Output() dataChanged = new EventEmitter<any>();
  @Output() itemSelected = new EventEmitter<any>();

  ngOnInit(): void {
    this.loadData();
    
    // ❌ VIOLATION 2: fromEvent subscription without cleanup
    // This will continue listening even after component is destroyed
    fromEvent(document, 'click').subscribe((event) => {
      console.log('Document clicked:', event);
    });
    
    // ❌ VIOLATION 3: setInterval without clearInterval
    // This timer will keep running after component destruction
    setInterval(() => {
      this.lastUpdate = new Date().toLocaleTimeString();
    }, 1000);
    
    // Another memory leak - interval subscription without cleanup
    interval(5000).subscribe(() => {
      console.log('Auto-refresh triggered');
      this.loadData();
    });
    
    // ❌ VIOLATION 1: Self-subscribing to own EventEmitter without cleanup
    this.dataChanged.subscribe((data) => {
      console.log('Data changed:', data);
    });
  }
  
  // ❌ VIOLATION 5: Missing ngOnDestroy - no cleanup for subscriptions!
  // Should implement OnDestroy and clean up all subscriptions

  loadData(): void {
    // Simulating data load
    this.tableData = [
      { id: 1, name: 'Item 1', status: 'Active' },
      { id: 2, name: 'Item 2', status: 'Inactive' },
      { id: 3, name: 'Item 3', status: 'Active' },
      { id: 4, name: 'Item 4', status: 'Pending' },
      { id: 5, name: 'Item 5', status: 'Active' }
    ];
    
    this.dataChanged.emit(this.tableData);
  }

  sortData(): void {
    this.tableData.sort((a, b) => a.name.localeCompare(b.name));
  }

  // ❌ VIOLATION 6: Method called in template - runs on every change detection
  // This is extremely inefficient and should use a pipe or computed property
  filterData(data: any[]): any[] {
    if (!this.searchTerm) {
      return data;
    }
    
    // This filtering runs on EVERY change detection cycle!
    return data.filter(item => 
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editItem(item: any): void {
    console.log('Editing item:', item);
    this.itemSelected.emit(item);
  }

  deleteItem(item: any): void {
    const index = this.tableData.indexOf(item);
    if (index > -1) {
      this.tableData.splice(index, 1);
      this.dataChanged.emit(this.tableData);
    }
  }
}

// Made with Bob