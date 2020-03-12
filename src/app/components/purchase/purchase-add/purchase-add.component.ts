import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as ROUTES from '../../../helpers/routes';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss'],
})
export class PurchaseAddComponent implements OnInit {
  ROUTES = ROUTES;
  customerId: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get("customerId");
  }

}
