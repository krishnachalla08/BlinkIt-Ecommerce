import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductComponent } from './pages/products/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CreateProduct } from './features/product/create-product/create-product';
import { Category } from './features/product/category/category';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { AdminGuard } from './core/guards/admin.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export const routes: Routes = [

  {path: '', redirectTo: '/products', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductComponent },

  { path: 'cart', component: CartComponent },

  { path: 'orders', component: OrdersComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },

  { path: 'createProduct', component: CreateProduct, canActivate: [AdminGuard] },

  { path: 'category', component: Category, canActivate: [AdminGuard] }
];