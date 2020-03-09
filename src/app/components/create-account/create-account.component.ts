import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as ROUTES from '../../helpers/routes';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent {
  ROUTES = ROUTES;

  signUpForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    reEnterPassword: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController) { }

  async createAccount() {
    let loading;
    if (this.validate()) {
      loading = await this.loadingController.create({ message: 'Please wait...' });
      await loading.present();
      this.userService
        .signUp(this.signUpForm.controls.email.value,
          this.signUpForm.controls.password.value,
          this.signUpForm.controls.name.value)
        .subscribe(async () => {
          await loading.dismiss();
          const toast = await this.toastController.create({
            message: 'Account data saved successfully.',
            duration: 3000,
            position: 'top',
            color: 'success'
          });
          toast.present();
          this.router.navigate([ROUTES.LOGIN_ROUTE]);
        }, async () => {
          this.showMessage('Failed to create account.');
          await loading.dismiss();
        });
    }
  }

  validate() {
    let isValid = true;
    if (this.signUpForm.controls.name.errors) {
      this.showMessage('Name is required');
      isValid = false;
    } else if (this.signUpForm.controls.email.errors) {
      this.showMessage('Valid email is required');
      isValid = false;
    } else if (this.signUpForm.controls.password.errors || this.signUpForm.controls.reEnterPassword.errors) {
      this.showMessage('Password is required');
      isValid = false;
    } else if (this.signUpForm.controls.password.value != this.signUpForm.controls.reEnterPassword.value) {
      this.showMessage('Passwords did not match');
      isValid = false;
    }
    return isValid;
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
