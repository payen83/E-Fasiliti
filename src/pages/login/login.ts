import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { FirebaseProvider } from '../../providers/firebase/firebase';
//import { MainPage } from '../../pages/pages';

import { UploadPage } from '../upload/upload';

import { User } from '../../providers/user';
import { AdminLoginPage } from '../admin-login/admin-login';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public firebaseProvider: FirebaseProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  back(){
    this.navCtrl.pop();
  }

  adminLogin(){
    this.navCtrl.push(AdminLoginPage);
  }

  // Attempt to login in through our User service
  // doLogin() {
  //   this.user.login(this.account).subscribe((resp) => {
  //     this.navCtrl.push(MainPage);
  //   }, (err) => {
  //     this.navCtrl.push(MainPage);
  //     // Unable to log in
  //     let toast = this.toastCtrl.create({
  //       message: this.loginErrorString,
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     toast.present();
  //   });
  // }

  doLogin() {
    let loader = this.loadingCtrl.create({
      spinner: "circles"
    });

    loader.present();

    this.firebaseProvider.login(this.account).then(data=>{

      loader.dismiss();

      if(data=='success'){

          this.firebaseProvider.getUser(this.account);
  
          this.navCtrl.push(UploadPage);

      } else{
        if(data=='auth/wrong-password'){
          alert('Username or password invalid');

         } else{
             alert('Error Login: '+data);
         }        
      }
    })

  }
}



    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(UploadPage);
    //   loader.dismiss();
    // }, (err) => {
    //   this.navCtrl.push(UploadPage);
    //   loader.dismiss();
      // Unable to log in
      // let toast = this.toastCtrl.create({
      //   message: this.loginErrorString,
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
    //});
  