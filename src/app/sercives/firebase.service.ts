import { inject, Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from '@firebase/auth'
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc } from '@angular/fire/firestore'
import { UtilsService } from '../services/utils.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);


  // ===============Autenticacion================
getAuth() {
  return getAuth();
}


  // =====Acceder=====

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // =====Crear Usuario=====

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // =====ActualizarUsuario=====

  
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // ===== Enviar email para recuperar la contraseña =====

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // ================ Base de datos ================

  // == Setear un documento ==

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  // ==== Obtener un documento ====


  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
