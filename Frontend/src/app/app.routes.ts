import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductComponent } from './pages/products/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductComponent },

  { path: 'cart', component: CartComponent },

  { path: 'orders', component: OrdersComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' }

];