import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  removeFromLocalStorage(arg0: string) {
    throw new Error('Method not implemented.');
  }


  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController)



  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Toma una foto'
    });

  };


  router = inject(Router);

  // LOADING
  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    return loading;
  }

  // TOAST
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // ====entrar a cualquier pagina disponible====

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // ==== Guarda un elemento en el localstorage ====

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  //  ==== obtiene un elemento desde localstorage ====

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  // ======Modal =======

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;


  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

}
