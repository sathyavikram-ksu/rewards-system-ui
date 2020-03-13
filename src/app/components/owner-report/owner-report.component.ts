import { Component, OnInit } from '@angular/core';
import * as ROUTES from '../../helpers/routes';
import { LoadingController, AlertController } from '@ionic/angular';
import { PurchaseService } from '../../services/purchase.service';
import { Purchase } from '../../models/purchase';
import { getPickUpDate } from '../../helpers/helpers';

@Component({
  selector: 'app-owner-report',
  templateUrl: './owner-report.component.html',
  styleUrls: ['./owner-report.component.scss'],
})
export class OwnerReportComponent implements OnInit {
  ROUTES = ROUTES;
  reportDate: string;
  purchaseList: Purchase[];

  constructor(private purchaseService: PurchaseService,
    private alertController: AlertController,
    private loadingController: LoadingController) { }

  ngOnInit() { }

  async generateReport() {
    let loading = await this.loadingController.create({ message: 'Generating report...' });
    await loading.present();
    if (this.reportDate) {
      try {
        this.purchaseList = await this.purchaseService.getPurchasesByDay(getPickUpDate(this.reportDate));
      } catch (e) {
        this.showMessage('Failed to generate report. Try again.');
      }
    } else {
      this.showMessage('Select date to generate report');
    }
    await loading.dismiss();
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
