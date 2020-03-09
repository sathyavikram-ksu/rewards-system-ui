import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as ROUTES from '../../helpers/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  ROUTES = ROUTES;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController) { }

  async ngOnInit() {
    if (this.userService.isSignedIn()) {
      this.router.navigate([ROUTES.DASHBOARD_ROUTE]);
    }
  }

  async onSignIn() {
    let loading;
    if (this.loginForm.valid) {
      try {
        loading = await this.loadingController.create({ message: 'Please wait...' });
        await loading.present();
        await this.userService.
          signIn(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
        await loading.dismiss();
        this.router.navigate([ROUTES.DASHBOARD_ROUTE]);
      } catch (error) {
        await loading.dismiss();
        this.showMessage('Incorrect email or password.');
      }
    } else {
      if (this.loginForm.controls.email.errors) {
        this.showMessage('Valid email is required.');
      } else if (this.loginForm.controls.password.errors) {
        this.showMessage('Password is required.');
      }
    }
  }

  private async showMessage(message: string) {
    if (message.length > 0) {
      const alert = await this.alertController.create({
        header: 'Alert',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
