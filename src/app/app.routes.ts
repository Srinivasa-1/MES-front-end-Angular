
import { Routes } from '@angular/router';
import { OrderList } from './order-list/order-list';

export const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrderList },
  { path: '**', redirectTo: '/orders' }
];