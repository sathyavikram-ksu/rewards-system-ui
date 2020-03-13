import { FormGroup } from '@angular/forms';
import { Customer } from './customer';
import { getPickUpDate } from '../helpers/helpers';

export const enum ItemType {
    ICE_CREAM = 'ICE_CREAM',
    YOGURT = 'YOGURT'
}

export const enum PurchaseType {
    PAID = 'PAID',
    PRE_ORDER = 'PRE_ORDER',
    MONTHLY_FREE_FOR_50 = 'MONTHLY_FREE_FOR_50',
    MONTHLY_FREE_FOR_GOLD = 'MONTHLY_FREE_FOR_GOLD'
}

export class Purchase {
    createdAt: number;
    updatedAt: number;
    id: number;
    itemType: ItemType;
    purchaseType: PurchaseType;
    amount: number;
    points: number;
    pickUpDate: number;
    pickUpSlot: number;
    customer: Customer;

    constructor(purchaseForm: FormGroup, customerId: number) {
        this.itemType = purchaseForm.controls.itemType.value;
        this.purchaseType = purchaseForm.controls.purchaseType.value;
        this.amount = purchaseForm.controls.amount.value;
        this.points = purchaseForm.controls.points.value;
        if (this.purchaseType == PurchaseType.PRE_ORDER) {
            this.pickUpDate = getPickUpDate(purchaseForm.controls.pickUpDate.value);
            this.pickUpSlot = +purchaseForm.controls.pickUpSlot.value;
        }
        this.customer = {
            id: customerId
        } as Customer;
    }
}