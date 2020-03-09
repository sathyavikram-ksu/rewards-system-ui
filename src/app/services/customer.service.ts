import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getUrl } from '../helpers/helpers';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private URL_PREFIX = 'customer/';
  private _customerListSubject: BehaviorSubject<Customer[]> = new BehaviorSubject([]);
  private readonly _customerListObservable: Observable<Customer[]> = this._customerListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.http.get<Customer[]>(getUrl(this.URL_PREFIX)).subscribe(customerList => {
      this._customerListSubject.next(customerList);
    });
  }

  getCustomerList() {
    return this._customerListObservable;
  }

  addEdit(customer: Customer, customerId?: string) {
    if (customerId) {
      return this.http.put<Customer>(getUrl(this.URL_PREFIX + customerId), customer);
    }
    return this.http.post<Customer>(getUrl(this.URL_PREFIX), customer);
  }

  getById(customerId: string): Observable<Customer> {
    return this.getCustomerList().pipe(
      map(customerObjList => customerObjList.find(customerObj => customerObj.id.toString() === customerId))
    );
  }

  async delete(customerId: string) {
    await this.http.delete(getUrl(this.URL_PREFIX) + customerId).toPromise();
  }
}
