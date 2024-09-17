import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 firebaseSvc= inject(FirebaseService);
 utilsSvb = inject(UtilsService);

  ngOnInit() {
  }

  // cerrar sesion

  signOut(){
    this.firebaseSvc.signOut();
  }



}
