import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from '../models/purchase';
import { getUrl } from '../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private URL_PREFIX = 'purchase/';

  constructor(private http: HttpClient) { }

  save(purchase: Purchase) {
    return this.http.post<Purchase>(getUrl(this.URL_PREFIX), purchase);
  }

  getPurchasesByCustomer(purchaseId: string) {
    return this.http.get<Purchase[]>(getUrl(this.URL_PREFIX) + purchaseId).toPromise();
  }

  getPurchasesByDay(dayMilliSeconds: number) {
    return this.http.get<Purchase[]>(getUrl(this.URL_PREFIX) + 'bydate/' + dayMilliSeconds).toPromise();
  }

  getAvailableSlots(pickUpDate: number) {
    return this.http.get<number[]>(getUrl(this.URL_PREFIX) + 'available-slots/' + pickUpDate).toPromise();
  }

  async delete(purchaseId: number) {
    await this.http.delete(getUrl(this.URL_PREFIX) + purchaseId).toPromise();
  }
}
