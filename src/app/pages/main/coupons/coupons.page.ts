
import { Component, Input, OnInit } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner';
import { IonicSlides, NavController, NavParams, Platform } from '@ionic/angular';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from 'src/app/services/coupons.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {
  
  public couponsActive: Boolean;
  public coupons: Coupon[];

  // @Input() slides!: Coupon[];
  swiperModules = [IonicSlides];

  constructor(
    private couponsService: CouponsService,
    private navParams: NavParams,
    private navController: NavController,
    private toastService: ToastService,
    private platform: Platform
  ) { 
this.coupons = [];
this.couponsActive = false;
this.platform.backButton.subscribeWithPriority(10, () => {
  this.resetCoupons();  // Desactiva los cupones al volver
});

  }

  ngOnInit() {
    this.couponsService.getCoupons().then((coupons:Coupon[]) =>{
      this.coupons = coupons;
      console.log(this.coupons);
      
    })
 
      
    
  }

  changeActive(coupon: Coupon) {
    this.coupons.forEach(c => c.active = false);  // Desactiva todos los cupones
    coupon.active = true;                         // Activa solo el cupón seleccionado
    this.couponsActive = true;                    // Marca que hay cupones activos
  }
  goToCard(){
    this.navParams.data["coupons"] = this.coupons.filter(c=> c.active);
    this.navController.navigateForward('card-coupon')
  }

  onSlideClick(coupon: Coupon) {
    this.changeActive(coupon);  // Activar el cupón
    this.goToCard();            // Generar el QR y redirigir
  }

  goToProducts(){
    this.navParams.data["products"] = this.coupons.filter(c=> c.active);
    this.navController.navigateForward('products')
  }
  goToMaps(){
    this.navParams.data["maps"] = this.coupons.filter(c=> c.active);
    this.navController.navigateForward('maps')
  }

  resetCoupons() {
    this.coupons.forEach(c => c.active = false);  // Desactiva todos los cupones
    this.couponsActive = false;                   // Indica que no hay cupones activos
  }


  startCamera() {

    CapacitorBarcodeScanner.scanBarcode({
      hint: 0
    }).then((value: CapacitorBarcodeScannerScanResult) => {
      const result = value.ScanResult;

      try {
        let coupon: Coupon = JSON.parse(result);

        if (this.isCouponValid(coupon)) {
          this.toastService.showToast('QR escaneado con exito')
          this.coupons.push(coupon);
        } else {
          this.toastService.showToast('QR invalido')
        }
      } catch (error) {
        this.toastService.showToast('QR error')
        console.error(error);
      }

    })

  }

  private isCouponValid(coupon: Coupon) {
    return coupon && coupon.id_product && coupon.img && coupon.name && coupon.discount;
  }
}
