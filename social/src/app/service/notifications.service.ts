import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toastController: ToastController) { }

  public async sendToast(text: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      message: text,
      duration: 2000
    });
    toast.present();
  }
}
