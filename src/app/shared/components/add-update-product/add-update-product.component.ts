import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/products.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  firebaseSvc = inject(FirebaseService);
  utlsSvc = inject(UtilsService)

  user = {} as User;


  ngOnInit() {
    this.user = this.utlsSvc.getFromLocalStorage('user');
    if( this.product ) this.form.setValue(this.product)
  }

  async takeImage() {
    const dataUrl = (await this.utlsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    if(this.form.valid){
      if(this.product) this.updateProduct();
      else this.createProduct();
    }
  }


  
// crear producto
  async createProduct() {
    if (this.form.valid) {

      let path = `users/${this.user.uid}/products`

      const loading = await this.utlsSvc.loading();
      await loading.present();

      // subir imagen y obtener url
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utlsSvc.dismissModal({success: true});

        this.utlsSvc.presentToast({
          message: 'Producto creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })



      }).catch(error => {
        console.log(error);

        this.utlsSvc.presentToast({
          message: 'Usuario o Password inválida',
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

  // actualizar producto
  async updateProduct() {
    if (this.form.valid) {

      let path = `users/${this.user.uid}/products/${this.product.id}`

      const loading = await this.utlsSvc.loading();
      await loading.present();

      //si cambio la imagen, subir imagen y obtener url
      if(this.form.value.image !== this.product.image){

        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }

      delete this.form.value.id;

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

        this.utlsSvc.dismissModal({success: true});

        this.utlsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'

        })



      }).catch(error => {
        console.log(error);

        this.utlsSvc.presentToast({
          message: 'Usuario o Password inválida',
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



}
