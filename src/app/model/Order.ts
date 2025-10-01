// src/app/models/order.model.ts
export interface Order {
  id?: number;
  orderNumber: string;
  productName: string;
  quantity: number;
  status: OrderStatus;
  customerName: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// DEBUG FOCUS: API Response wrapper for pagination
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}