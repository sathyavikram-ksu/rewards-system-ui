import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import * as ROUTES from '../../helpers/routes';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  ROUTES = ROUTES;
  customerId: string;
  customer: Customer;
  customerSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get("customerId");
    this.fetchCustomerDetails();
  }

  fetchCustomerDetails() {
    this.customerSubscription = this.customerService.getById(this.customerId).subscribe(customer => {
      this.customer = customer;
    });
  }

  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
  }
}
