import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Purchase } from '../../../models/purchase';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
})
export class PurchaseListComponent implements OnInit {
  @Input() purchaseList: Purchase[];
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  delete(purchaseId: string) {
    this.onDelete.emit(+purchaseId);
  }
}
