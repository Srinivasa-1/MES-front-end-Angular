import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../service/OrderService';

import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../model/order';

@Component({
  selector: 'app-order-from',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './order-from.html',
  styleUrl: './order-from.css'
})
export class OrderFrom {
  orderForm: FormGroup;
  isEditMode: boolean = false;
  orderStatuses = Object.values(OrderStatus);
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<OrderFrom>,
    @Inject(MAT_DIALOG_DATA) public data: { order?: Order }
  ) {
    this.isEditMode = !!data?.order;
    this.orderForm = this.createForm();
    
    if (this.isEditMode && data.order) {
      this.populateForm(data.order);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      orderNumber: ['', [Validators.required, Validators.minLength(3)]],
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      customerName: ['', Validators.required],
      status: [OrderStatus.PENDING, Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
  }

  private populateForm(order: Order): void {
    this.orderForm.patchValue({
      orderNumber: order.orderNumber,
      productName: order.productName,
      quantity: order.quantity,
      customerName: order.customerName,
      status: order.status,
      priority: order.priority
    });
    
    // Disable order number in edit mode as it shouldn't change
    this.orderForm.get('orderNumber')?.disable();
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;
      
      // For edit mode, include the original order number
      if (this.isEditMode && this.data.order) {
        formData.orderNumber = this.data.order.orderNumber;
      }

      const operation = this.isEditMode 
        ? this.orderService.updateOrder(this.data.order!.id!, formData)
        : this.orderService.createOrder(formData);

      operation.subscribe({
        next: (result) => {
          console.log('Operation successful:', result);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Operation failed:', error);
          alert('Error: ' + error.message);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getTitle(): string {
    return this.isEditMode ? 'Edit Order' : 'Create New Order';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update Order' : 'Create Order';
  }
}
