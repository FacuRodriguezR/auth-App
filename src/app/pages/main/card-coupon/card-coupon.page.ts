import { Component, OnInit } from '@angular/core';
import { NavParams, ToastController } from '@ionic/angular';
import { Coupon } from '../../../models/coupon';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-card-coupon',
  templateUrl: './card-coupon.page.html',
  styleUrls: ['./card-coupon.page.scss'],
})
export class CardCouponPage implements OnInit {

  public QRCode!: string;
  public couponImage!: string;  // Propiedad para la imagen
  public discount! :number;
  public couponName! :string;
  public validity! : string;
  public nameCoupon! : string;
  qr = 0;


  constructor(
    private navParams: NavParams,
    private toastController: ToastController
  ) {

    
   }

  ngOnInit() {

    const coupons = this.navParams.data['coupons'];
    if (coupons && coupons.length > 0) {
       // Generar el QR con los datos de los cupones
      this.couponImage = coupons[0].img;  // Asignar la imagen del primer cupón activo
      this.discount = coupons[0].discount;
      this.couponName = coupons[0].coupon;
      this.validity = coupons[0].vigencia;
      this.nameCoupon = coupons[0].name;
    }
  }

  async copyToClipboard(text: string) {
    try {
      await Clipboard.write({
        string: text
      });
      this.showToast('Texto copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      mode: 'ios',
      cssClass: 'ion-text-center',
      animated: true,
  
    });
    toast.present();
  }

  generarPdf() {
    // Generar el QR solo con el descuento
    this.QRCode = this.couponName.toString();  // Convertir el descuento a string para el QR
    this.qr = 1;  // Cambiar el estado para indicar que el QR fue generado
  }

}
