import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Purchase } from '../../../models/purchase';

@Component({
  selector: 'app-purchase-points',
  templateUrl: './purchase-points.component.html',
  styleUrls: ['./purchase-points.component.scss'],
})
export class PurchasePointsComponent implements OnInit, OnChanges {
  @Input() purchaseList: Purchase[];
  totalPoints = 0;
  thisMonthPoints = 0;
  constructor() { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  init() {
    this.calculatePoints();
  }

  calculatePoints() {
    this.totalPoints = 0;
    this.thisMonthPoints = 0;
    const todayDate = new Date();
    const firstMonthDayTime = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).getTime();

    if (this.purchaseList) {
      this.purchaseList.forEach(purchaseObj => {
        this.totalPoints += purchaseObj.points;
        if (purchaseObj.createdAt >= firstMonthDayTime) {
          this.thisMonthPoints += purchaseObj.points;
        }
      })
    }
  }
}
