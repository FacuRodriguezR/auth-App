import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  
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
  async presentToast(opts? : ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // ====entrar a cualquier pagina disponible====

  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  // ==== Guarda un elemento en el localstorage ====

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  //  ==== obtiene un elemento desde localstorage ====

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }


}
