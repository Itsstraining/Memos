import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { NoteService } from './note.service';
// import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: firebase.default.UserInfo;
  public openNav: boolean;
  authState: any = null;

  constructor(private auth: AngularFireAuth, private router: Router, private noteSer: NoteService) {
    this.auth.authState.subscribe((user) => {
      this.authState = user;
      if (user) {
        this.user = user;
        this.noteSer.addUserMail(user.email);
        this.openNavBar();
        // this.router.navigate(['archive-page']);
        this.router.navigate(['note-page']);


      } else {
        this.disableNavBar();
      }
    });
  }

  // all firebase getdata functions

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : ''
  }

  get currentUserName(): string {
    return this.authState['email']
  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn)) {
      return true
    } else {
      return false
    }
  }

  registerWithEmail(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }



  loginWithEmail(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  
  checkLogin() {
    setTimeout(() => {
      if (this.user == undefined) {
        this.router.navigate(['sign-in']);
      } else {

      }
    }, 500);
  }


  openNavBar() {
    this.openNav = true;

    return this.openNav;
  }
  disableNavBar() {
    this.openNav = false;
    return this.openNav;
  }

  login() {
    const provider = new firebase.default.auth.GoogleAuthProvider();
    try {

      this.auth.signInWithPopup(provider);

    }
    catch (err) {
      // alert("login failed");
    }
  }

  signOut(): void {
    try {
      this.noteSer.deleteUserMail();
      this.auth.signOut();
      this.user = null;
      this.noteSer.userMail = undefined;
      this.noteSer.preUserMail = undefined;
      this.noteSer.getData();
      this.router.navigate(['']);

      setTimeout(() => {
        window.location.reload();
      }, 10);

    } catch (err) {
      // alert("Sigout failed");

    }
  }

}
