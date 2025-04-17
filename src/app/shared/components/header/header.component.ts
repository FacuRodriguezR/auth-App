import { Component, inject, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/sercives/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton! : string;
  @Input() isModal! : boolean;
  @Input() signOutBtn!: boolean;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService)

  ngOnInit() {}


  dismissModal(){
    this.utilsSvc.dismissModal();
  }


  signOut() {
    this.firebaseSvc.signOut();
  }
}
