import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/products.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 firebaseSvc= inject(FirebaseService);
 utilsSvb = inject(UtilsService);

 products: Product[] = [];

  ngOnInit() {
  
  }

  // obtener datos del localStorage

user(): User{
  return this.utilsSvb.getFromLocalStorage('user');
}

ionViewWillEnter() {
  this.getProducts();
}

getProducts(){
   let path = `users/${this.user().uid}/products`;

  let sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any) => {
      console.log(res);
      this.products = res;
      sub.unsubscribe();
    }
   })
}

  // cerrar sesion

  signOut(){
    this.firebaseSvc.signOut();
    
  }

  addUpdateProduct() {
    this.utilsSvb.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal' 
    })
  }



}
