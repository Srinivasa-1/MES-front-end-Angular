
import { Routes } from '@angular/router';
import { OrderList } from './order-list/order-list';
import { Dashboard } from './dashboard/dashboard';
import { Reports } from './reports/reports';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'orders', component: OrderList },
  { path: 'reports', component: Reports },
  { path: '**', redirectTo: '/dashboard' }
];