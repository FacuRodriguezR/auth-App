import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

  })

  firebaseSvc = inject(FirebaseService);
  utlsSvc = inject(UtilsService)



  ngOnInit() {
  }

 async submit(){
    if (this.form.valid){

      const loading = await this.utlsSvc.loading();
      await loading.present();

      
      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res=> {

        this.utlsSvc.presentToast({
          message: 'Correo enviado con éxito',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'mail-outline'

        });
        this.utlsSvc.routerLink('/auth');
        this.form.reset();

      }).catch(error => {
        console.log(error);

        this.utlsSvc.presentToast({
          message: 'Usuario o Password inválida',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'

        })
      }).finally(()=> {
        loading.dismiss();
      })
    }
  }





}
