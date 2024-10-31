import { Component, inject, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from 'src/app/services/coupons.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public couponsActive: Boolean;
  public coupons: Coupon[];
  swiperModules = [IonicSlides];

  
couponsService = inject(CouponsService);

  constructor(
    
  ) {
    this.coupons = [];
    this.couponsActive = false;
    
   }


  ngOnInit() {
    this.couponsService.getCoupons().then((coupons:Coupon[]) =>{
      this.coupons = coupons;
      console.log(this.coupons);
      
    })
  }

}
