import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { PurchaseService } from '../../services/purchase.service';
import { Customer } from '../../models/customer';
import { Purchase } from '../../models/purchase';
import * as ROUTES from '../../helpers/routes';
import { isGoldCustomer } from '../../helpers/helpers';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent {
  ROUTES = ROUTES;
  customerId: string;
  customer: Customer;
  purchaseList: Purchase[];
  customerSubscription: Subscription;
  goldCustomer = false;

  constructor(private route: ActivatedRoute,
    private customerService: CustomerService,
    private purchaseService: PurchaseService,
    private toastController: ToastController) { }

  ionViewWillEnter() {
    this.customerId = this.route.snapshot.paramMap.get("customerId");
    this.init();
  }

  init() {
    this.fetchCustomerDetails();
    this.fetchCustomerPurchaseList();
  }

  private fetchCustomerDetails() {
    this.customerSubscription = this.customerService.getById(this.customerId).subscribe(customer => {
      this.customer = customer;
    });
  }

  private async fetchCustomerPurchaseList() {
    this.purchaseList = await this.purchaseService.getPurchasesByCustomer(this.customerId);
    this.goldCustomer = isGoldCustomer(this.purchaseList);
  }

  async onDelete(purchaseId: number) {
    try {
      await this.purchaseService.delete(purchaseId);
      this.init();
      const toast = await this.toastController.create({
        message: 'Deleted purchase successfully.',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Failed to delete purchase data.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }

  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
  }
}
