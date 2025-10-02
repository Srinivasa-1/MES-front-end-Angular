import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../service/OrderService';
import { Order, OrderStatus } from '../model/Order';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-orderfromcomponent',
  imports: [MatDialogContent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './orderfromcomponent.html',
  styleUrl: './orderfromcomponent.css'
})
export class Orderfromcomponent {
  orderForm: FormGroup;
  isSubmitting = false;
  
  // DEBUG FOCUS: Enum usage in template
  orderStatuses = Object.values(OrderStatus);
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<Orderfromcomponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; order?: Order }
  ) {
    // DEBUG FOCUS: Reactive form initialization
    this.orderForm = this.createForm();
    console.log('OrderFormComponent initialized with mode:', data.mode);
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.order) {
      console.log('Editing existing order:', this.data.order);
      this.populateForm(this.data.order);
    } else {
      console.log('Creating new order');
    }
  }

  private createForm(): FormGroup {
    // DEBUG FOCUS: Form controls with validation
    return this.fb.group({
      orderNumber: ['', 
        [
          Validators.required, 
          Validators.minLength(3),
          Validators.pattern('^[A-Za-z0-9_-]+$') // Alphanumeric with underscores and hyphens
        ]
      ],
      productName: ['', 
        [
          Validators.required, 
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      quantity: [1, 
        [
          Validators.required, 
          Validators.min(1),
          Validators.max(10000)
        ]
      ],
      customerName: ['', 
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],
      status: [OrderStatus.PENDING, [Validators.required]],
      priority: ['MEDIUM', [Validators.required]]
    });
  }

  private populateForm(order: Order): void {
    console.log('Populating form with order data:', order);
    this.orderForm.patchValue({
      orderNumber: order.orderNumber,
      productName: order.productName,
      quantity: order.quantity,
      customerName: order.customerName,
      status: order.status,
      priority: order.priority
    });
    
    // DEBUG FOCUS: For edit mode, disable order number as it shouldn't change
    if (this.data.mode === 'edit') {
      this.orderForm.get('orderNumber')?.disable();
    }
  }

  onSubmit(): void {
    console.log('Form submission started, valid:', this.orderForm.valid);
    
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      
      // DEBUG FOCUS: Prepare form data - ensure orderNumber is included for edit mode
      let formData = this.orderForm.value;
      if (this.data.mode === 'edit' && this.data.order) {
        formData = {
          ...formData,
          orderNumber: this.data.order.orderNumber // Include the original order number
        };
      }

      console.log('Submitting form data:', formData);

      const operation = this.data.mode === 'create' 
        ? this.orderService.createOrder(formData)
        : this.orderService.updateOrder(this.data.order!.id!, formData);

      operation.subscribe({
        next: (result) => {
          console.log(`${this.data.mode} operation successful:`, result);
          this.isSubmitting = false;
          this.dialogRef.close(true); // true indicates success
        },
        error: (error) => {
          console.error(`${this.data.mode} operation failed:`, error);
          this.isSubmitting = false;
          // Error is handled by the service, but we log it here for debugging
        },
        complete: () => {
          console.log(`${this.data.mode} operation completed`);
        }
      });
    } else {
      console.warn('Form is invalid, showing validation errors');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    // DEBUG FOCUS: Trigger validation display for all fields
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  onCancel(): void {
    console.log('Form cancelled by user');
    this.dialogRef.close(false); // false indicates cancellation
  }

  // DEBUG FOCUS: Form validation helpers for template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.orderForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }

  getTitle(): string {
    return this.data.mode === 'create' ? 'Create New Order' : 'Edit Order';
  }

  getSubmitButtonText(): string {
    return this.isSubmitting ? 
      (this.data.mode === 'create' ? 'Creating...' : 'Updating...') :
      (this.data.mode === 'create' ? 'Create Order' : 'Update Order');
  }
}