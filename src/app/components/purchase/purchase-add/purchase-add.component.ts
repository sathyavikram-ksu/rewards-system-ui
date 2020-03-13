import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as ROUTES from '../../../helpers/routes';
import { getPickUpDate } from '../../../helpers/helpers';
import { ItemType, PurchaseType, Purchase } from '../../../models/purchase';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PurchaseService } from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss'],
})
export class PurchaseAddComponent implements OnInit {
  ROUTES = ROUTES;
  customerId: string;
  isPreOrder = false;
  isGoldCustomer = false;
  todayDate: string;
  nextWeekDate: string;
  availableSlots: number[] = [];
  claimType: string;

  purchaseForm = new FormGroup({
    isPreOrder: new FormControl(false, [
      Validators.required
    ]),
    itemType: new FormControl(ItemType.ICE_CREAM, [
      Validators.required
    ]),
    purchaseType: new FormControl(PurchaseType.PAID, [
      Validators.required
    ]),
    amount: new FormControl(undefined, [
      Validators.required
    ]),
    points: new FormControl(0, [
      Validators.required
    ]),
    pickUpDate: new FormControl(undefined, [
      Validators.required
    ]),
    pickUpSlot: new FormControl(undefined, [
      Validators.required
    ])
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private purchaseService: PurchaseService) {
    this.todayDate = new Date().toISOString();
    let dateNext = new Date();
    dateNext.setDate(new Date().getDate() + 6);
    this.nextWeekDate = dateNext.toISOString();
  }

  ngOnInit() {
    this.purchaseForm.controls.amount.valueChanges.subscribe(amount => {
      this.purchaseForm.patchValue({
        points: this.isGoldCustomer ? Math.floor(amount) * 2 : Math.floor(amount)
      });
    });

    this.purchaseForm.controls.isPreOrder.valueChanges.subscribe(isPreOrder => {
      this.isPreOrder = isPreOrder;
      this.purchaseForm.patchValue({
        purchaseType: this.isPreOrder ? PurchaseType.PRE_ORDER : PurchaseType.PAID,
        itemType: ItemType.ICE_CREAM
      });
    });

    this.purchaseForm.controls.pickUpDate.valueChanges.subscribe(async (pickUpDateTime) => {
      this.availableSlots = [];
      let loading = await this.loadingController.create({
        message: 'Fetching available slots'
      });
      await loading.present();
      try {
        const pickUpDate = getPickUpDate(pickUpDateTime);
        this.availableSlots = await this.purchaseService.getAvailableSlots(pickUpDate);
        if (!this.availableSlots || this.availableSlots.length == 0) {
          this.showMessage('Slots not available for selected date. Select different date');
        }
      } catch (e) {
        this.showMessage('Error fetching slots');
      }
      await loading.dismiss();
    });

    this.customerId = this.route.snapshot.paramMap.get("customerId");
    this.claimType = this.route.snapshot.paramMap.get("claimType");
    this.isGoldCustomer = this.route.snapshot.paramMap.get("customerStatus") == 'true' ? true : false;
  }

  claimReward() {
    this.purchaseForm.patchValue({
      isPreOrder: false,
      purchaseType: this.claimType == 'MONTHLY_FREE_FOR_50' ? PurchaseType.MONTHLY_FREE_FOR_50 : PurchaseType.MONTHLY_FREE_FOR_GOLD,
      amount: 0,
      points: 0
    });
    this.savePurchase();
  }

  async savePurchase() {
    if (this.validate()) {
      let loading = await this.loadingController.create({ message: 'Please wait...' });
      await loading.present();
      this.purchaseService
        .save(new Purchase(this.purchaseForm, +this.customerId, this.isGoldCustomer))
        .subscribe(async () => {
          await loading.dismiss();
          const toast = await this.toastController.create({
            message: 'Purchase data saved successfully.',
            duration: 3000,
            position: 'top',
            color: 'success'
          });
          toast.present();
          this.router.navigate([ROUTES.CUSTOMER_DETAILS_ROUTE.replace(':customerId', this.customerId)]);
        }, async () => {
          this.showMessage('Failed to save purchase data.');
          await loading.dismiss();
        });
    }
  }

  validate() {
    let isValid = true;
    if (this.purchaseForm.controls.amount.errors) {
      this.showMessage('Enter valid purchase $ amount');
      isValid = false;
    } else if (this.isPreOrder && this.purchaseForm.controls.pickUpDate.errors) {
      this.showMessage('Select valid pre order date');
      isValid = false;
    } else if (this.isPreOrder && this.purchaseForm.controls.pickUpSlot.errors) {
      this.showMessage('Select slot for availabe date');
      isValid = false;
    }
    return isValid;
  }

  private async showMessage(message: string) {
    if (message.length > 0) {
      const alert = await this.alertController.create({
        header: message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
