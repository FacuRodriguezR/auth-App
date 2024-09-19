import { inject, Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from '@firebase/auth'
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { doc, getFirestore, setDoc, getDoc, addDoc, updateDoc, collection, collectionData, query, deleteDoc } from '@angular/fire/firestore'
import { UtilsService } from '../services/utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage'


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage)


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
  // obtener documentos de una coleccion

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  // == Setear un documento ==

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  // actualizar un documento

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path))
  }

  // eliminar un producto

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }

  // ==== Obtener un documento ====


  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  // agregar un documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  // almacenamiento

  // subir imagen

  async uploadImage(path: string, data_url: string) {
    await uploadString(ref(getStorage(), path), data_url, 'data_url');
    return await getDownloadURL(ref(getStorage(), path));
  }

  // obtener ruta de la imagen con su url

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path))
  }



}
