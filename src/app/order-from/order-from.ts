import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../service/OrderService';

import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<OrderFrom>
  ) {
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      customerName: ['', Validators.required],
      status: ['PENDING'],
      priority: ['MEDIUM']
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      console.log('Creating order:', orderData);
      
      this.orderService.createOrder(orderData).subscribe({
        next: (result) => {
          console.log('Order created:', result);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Create error:', error);
          alert('Error: ' + error.message);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
