import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  firebaseSvc = inject(FirebaseService);
  utlsSvc = inject(UtilsService)



  ngOnInit() {
  }

 async submit(){
    if (this.form.valid){

      const loading = await this.utlsSvc.loading();
      await loading.present();

      
      this.firebaseSvc.signIn(this.form.value as User).then(res=> {


        this.getUserInfo(res.user.uid);

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


  async getUserInfo(uid: string){
    if (this.form.valid){

      const loading = await this.utlsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      
      this.firebaseSvc.getDocument(path).then((user: User)=> {

        this.utlsSvc.saveInLocalStorage('user', user);
        this.utlsSvc.routerLink('/main/home');
        this.form.reset();

        this.utlsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'person-circle-outline'

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
      }).finally(()=> {
        loading.dismiss();
      })
    }
  }

}
