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

  // actualizar producto

 async addUpdateProduct(product?: Product) {
   let success = await this.utilsSvb.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {product}
    })
    if(success) this.getProducts();
  }

  // confirmar la eliminacion del producto

  async confirmDeleteProduct(product: Product) {
      this.utilsSvb.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'danger',
        
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteProduct(product)
          }
        }
      ]
    });
  

  }


  // eliminar producto

  async deleteProduct(product: Product) {
    

      let path = `users/${this.user().uid}/products/${product.id}`

      const loading = await this.utilsSvb.loading();
      await loading.present();

      //si cambio la imagen, subir imagen y obtener url
      let imagePath = await this.firebaseSvc.getFilePath(product.image);
      await this.firebaseSvc.deleteDocument(imagePath);


      this.firebaseSvc.deleteDocument(path).then(async res => {

        this.products = this.products.filter(p => p.id !== product.id);

        this.utilsSvb.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'

        })



      }).catch(error => {
        console.log(error);

        this.utilsSvb.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'

        })
      }).finally(() => {
        loading.dismiss();
      })
    
  }



}
