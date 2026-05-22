import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ⚠️ DELIBERATELY FLAWED COMPONENT FOR PR GOVERNANCE DEMO ⚠️
 * 
 * This component contains MULTIPLE intentional violations:
 * 
 * 1. DOM MANIPULATION: Direct DOM manipulation with document.getElementById
 * 2. DOM MANIPULATION: Using innerHTML (XSS vulnerability)
 * 3. DOM MANIPULATION: Direct style manipulation
 * 4. ARCHITECTURE: Not using Angular's ViewChild/template refs
 * 5. ACCESSIBILITY: Missing ARIA attributes and keyboard navigation
 * 6. CODE STANDARD: Using setTimeout without cleanup
 * 7. MEMORY LEAK: Event listeners added but never removed
 * 8. SECURITY: Potential XSS with innerHTML
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-container" *ngIf="isOpen">
      <!-- ❌ VIOLATION 5: Missing role, aria-modal, aria-labelledby -->
      <div class="modal-backdrop" (click)="closeModal()"></div>
      
      <div class="modal-content" id="modal-content-{{modalId}}">
        <div class="modal-header">
          <h2 id="modal-title-{{modalId}}">{{ title }}</h2>
          <!-- ❌ VIOLATION 5: Button without aria-label -->
          <button class="close-button" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-body" id="modal-body-{{modalId}}">
          <ng-content></ng-content>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn-primary" (click)="confirm()">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
      position: relative;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
      z-index: 1001;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 24px;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 32px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 32px;
      height: 32px;
      line-height: 1;
    }
    
    .close-button:hover {
      color: #333;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px;
      border-top: 1px solid #eee;
    }
    
    .btn-primary,
    .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .btn-primary {
      background-color: #2196F3;
      color: white;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
    }
  `]
})
export class ModalComponent implements OnInit {
  @Input() title: string = 'Modal Title';
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  modalId: string = Math.random().toString(36).substr(2, 9);
  private originalBodyOverflow: string = '';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.onModalOpen();
    }

    // ❌ VIOLATION 7: Adding event listener without cleanup
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });
  }

  // ❌ VIOLATION: Missing ngOnDestroy for cleanup!

  ngOnChanges(): void {
    if (this.isOpen) {
      this.onModalOpen();
    } else {
      this.onModalClose();
    }
  }

  private onModalOpen(): void {
    // ❌ VIOLATION 6: setTimeout without cleanup
    setTimeout(() => {
      this.setupModalBehavior();
      this.addCustomStyles();
      this.injectDynamicContent();
      this.lockBodyScroll();
    }, 100);
  }

  private setupModalBehavior(): void {
    // ❌ VIOLATION 1: Direct DOM manipulation with getElementById
    const modalContent = document.getElementById(`modal-content-${this.modalId}`);
    
    if (modalContent) {
      // ❌ VIOLATION 3: Direct style manipulation
      modalContent.style.animation = 'slideIn 0.3s ease-out';
      modalContent.style.transform = 'scale(1)';
      
      // ❌ VIOLATION 7: Adding click listener without cleanup
      modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    // ❌ VIOLATION 1: More direct DOM access
    const closeButton = modalContent?.querySelector('.close-button');
    if (closeButton) {
      // ❌ VIOLATION 3: Direct style manipulation
      (closeButton as HTMLElement).style.transition = 'all 0.2s';
    }
  }

  private addCustomStyles(): void {
    // ❌ VIOLATION 1 & 3: Creating and injecting style element directly
    const styleElement = document.createElement('style');
    styleElement.id = `modal-styles-${this.modalId}`;
    
    // ❌ VIOLATION 2: Using innerHTML
    styleElement.innerHTML = `
      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .modal-content {
        animation: slideIn 0.3s ease-out;
      }
    `;
    
    // ❌ VIOLATION 1: Direct DOM manipulation
    document.head.appendChild(styleElement);
  }

  private injectDynamicContent(): void {
    // ❌ VIOLATION 1: Direct DOM access
    const modalBody = document.getElementById(`modal-body-${this.modalId}`);
    
    if (modalBody) {
      // ❌ VIOLATION 2 & 8: Using innerHTML - XSS vulnerability!
      // This is extremely dangerous if content comes from user input
      const dynamicContent = `
        <div class="dynamic-content">
          <p>This content was injected via innerHTML</p>
          <script>console.log('This could be malicious!');</script>
        </div>
      `;
      
      // ❌ VIOLATION 6: setTimeout without cleanup
      setTimeout(() => {
        modalBody.innerHTML += dynamicContent;
      }, 200);
    }
  }

  private lockBodyScroll(): void {
    // ❌ VIOLATION 1 & 3: Direct body manipulation
    this.originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Prevent layout shift
    
    // ❌ VIOLATION 1: Adding class directly
    document.body.classList.add('modal-open');
  }

  private unlockBodyScroll(): void {
    // ❌ VIOLATION 1 & 3: Direct body manipulation
    document.body.style.overflow = this.originalBodyOverflow;
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
  }

  private onModalClose(): void {
    this.unlockBodyScroll();
    this.removeCustomStyles();
  }

  private removeCustomStyles(): void {
    // ❌ VIOLATION 1: Direct DOM manipulation
    const styleElement = document.getElementById(`modal-styles-${this.modalId}`);
    if (styleElement) {
      styleElement.remove();
    }
  }

  closeModal(): void {
    // ❌ VIOLATION 1 & 3: Animating with direct DOM manipulation
    const modalContent = document.getElementById(`modal-content-${this.modalId}`);
    if (modalContent) {
      modalContent.style.animation = 'slideOut 0.3s ease-in';
      modalContent.style.transform = 'scale(0.9)';
      modalContent.style.opacity = '0';
    }

    // ❌ VIOLATION 6: setTimeout without cleanup
    setTimeout(() => {
      this.isOpen = false;
      this.closed.emit();
      this.onModalClose();
    }, 300);
  }

  confirm(): void {
    this.confirmed.emit();
    this.closeModal();
  }

  // ❌ VIOLATION 4: Should use @ViewChild instead of getElementById
  // ❌ VIOLATION 1: Public method that does direct DOM manipulation
  public setModalContent(htmlContent: string): void {
    const modalBody = document.getElementById(`modal-body-${this.modalId}`);
    if (modalBody) {
      // ❌ VIOLATION 2 & 8: innerHTML with external content - XSS risk!
      modalBody.innerHTML = htmlContent;
    }
  }

  // ❌ VIOLATION 1 & 3: Public method for direct style manipulation
  public setModalSize(width: string, height: string): void {
    const modalContent = document.getElementById(`modal-content-${this.modalId}`);
    if (modalContent) {
      (modalContent as HTMLElement).style.width = width;
      (modalContent as HTMLElement).style.height = height;
    }
  }

  // ❌ VIOLATION: No cleanup in ngOnDestroy!
  // Should remove event listeners, style elements, and restore body styles
}

// Made with Bob