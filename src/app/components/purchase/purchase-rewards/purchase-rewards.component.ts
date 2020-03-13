import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Purchase } from '../../../models/purchase';
import { getFreeCountByMonth, getFreeCountByGold } from '../../../helpers/helpers';
import * as ROUTES from '../../../helpers/routes';

@Component({
  selector: 'app-purchase-rewards',
  templateUrl: './purchase-rewards.component.html',
  styleUrls: ['./purchase-rewards.component.scss'],
})
export class PurchaseRewardsComponent implements OnInit {
  @Input() purchaseList: Purchase[];
  @Input() customerId: string;
  freeCountByMonth = 0;
  freeCountByGold = 0;
  ROUTES = ROUTES;
  constructor() { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  init() {
    this.freeCountByMonth = getFreeCountByMonth(this.purchaseList);
    this.freeCountByGold = getFreeCountByGold(this.purchaseList);
  }
}
