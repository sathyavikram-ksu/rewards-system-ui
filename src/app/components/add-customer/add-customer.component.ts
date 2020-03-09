import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as ROUTES from '../../helpers/routes';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  ROUTES = ROUTES;
  customerId: string;
  customerSubscription: Subscription;

  addCustomerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    birthDate: new FormControl('', [
      Validators.required
    ])
  });

  constructor(private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get("customerId");
    this.fetchCustomerDetails();
  }

  async fetchCustomerDetails() {
    if (this.customerId) {
      let loading = await this.loadingController.create({ message: 'Please wait...' });
      this.customerSubscription = this.customerService.getById(this.customerId).subscribe(customer => {
        if(customer) {
          this.addCustomerForm.controls.name.setValue(customer.name);
          this.addCustomerForm.controls.address.setValue(customer.address);
          this.addCustomerForm.controls.birthDate.setValue(new Date(customer.birthDate).toISOString());
        }
      });
      await loading.dismiss();
    }
  }

  async onDelete() {
    const loading = await this.loadingController.create({ message: 'Please wait...' });
    try {
      await this.customerService.delete(this.customerId);
      this.customerService.getAllCustomers();
      const toast = await this.toastController.create({
        message: 'Customer delete successfully !!!',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      toast.present();
      await loading.dismiss();
      this.router.navigate([ROUTES.DASHBOARD_ROUTE]);
    } catch (error) {
      await loading.dismiss();
      this.showMessage('Failed to delete customer data.');
    }
  }

  async saveCustomer() {
    let loading;
    if (this.validate()) {
      loading = await this.loadingController.create({ message: 'Please wait...' });
      await loading.present();
      const customerObj = new Customer(
        this.addCustomerForm.controls.name.value,
        this.addCustomerForm.controls.address.value,
        new Date(this.addCustomerForm.controls.birthDate.value).getTime()
      );

      this.customerService
        .addEdit(customerObj, this.customerId)
        .subscribe(async (savedCustomerObj: Customer) => {
          this.customerService.getAllCustomers();
          await loading.dismiss();
          const toast = await this.toastController.create({
            message: 'Customer data saved successfully.',
            duration: 3000,
            position: 'top',
            color: 'success'
          });
          toast.present();
          this.router.navigate([ROUTES.CUSTOMER_DETAILS_ROUTE.replace(':customerId', '' + savedCustomerObj.id)]);
        }, async () => {
          this.showMessage('Failed to save customer data.');
          await loading.dismiss();
        });
    }
  }

  validate() {
    let isValid = true;
    if (this.addCustomerForm.controls.name.errors) {
      this.showMessage('Customer name is required');
      isValid = false;
    } else if (this.addCustomerForm.controls.address.errors) {
      this.showMessage('Customer address is required');
      isValid = false;
    } else if (this.addCustomerForm.controls.birthDate.errors) {
      this.showMessage('Customer birth date is required');
      isValid = false;
    }
    return isValid;
  }

  private async showMessage(message: string) {
    if (message.length > 0) {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
  }
}
