import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardCouponPageRoutingModule } from './card-coupon-routing.module';

import { CardCouponPage } from './card-coupon.page';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardCouponPageRoutingModule,
    QRCodeModule,
    SharedModule
  ],
  declarations: [CardCouponPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardCouponPageModule {}
