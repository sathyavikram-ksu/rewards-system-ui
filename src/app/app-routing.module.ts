import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import * as ROUTES from './helpers/routes';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { PurchaseAddComponent } from './components/purchase/purchase-add/purchase-add.component';

const routes: Routes = [
  { path: ROUTES.LOGIN_ROUTE, component: LoginComponent },
  { path: ROUTES.DASHBOARD_ROUTE, component: DashboardComponent },
  { path: ROUTES.CREATE_ACCOUNT_ROUTE, component: CreateAccountComponent },
  { path: ROUTES.ADD_CUSTOMER_ROUTE, component: AddCustomerComponent },
  { path: ROUTES.CUSTOMER_DETAILS_ROUTE, component: CustomerDetailsComponent },
  { path: ROUTES.EDIT_CUSTOMER_DETAILS_ROUTE, component: AddCustomerComponent },
  { path: ROUTES.ADD_PURCHASE_ROUTE, component: PurchaseAddComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
