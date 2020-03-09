import { Component, OnInit } from '@angular/core';
import * as ROUTES from '../../helpers/routes';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ROUTES = ROUTES;
  private customerList: Customer[] = [];
  customerListFilter: Customer[] = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getCustomerList().subscribe(list => {
      this.customerList = list;
      this.customerListFilter = this.customerList;
    });
  }

  initializeItems() {
    this.customerListFilter = this.customerList;
  }

  filterList(event) {
    this.initializeItems();
    let searchTerm = event.srcElement.value;
    if (!searchTerm || searchTerm.trim() === '') {
      return;
    }
    searchTerm = searchTerm.trim().toLowerCase();
    this.customerListFilter = this.customerList.filter(customerObj => {
      return customerObj.name.toLowerCase().includes(searchTerm) ||
        customerObj.address.toLowerCase().includes(searchTerm) ||
        customerObj.id.toString().includes(searchTerm);
    });
  }
}
