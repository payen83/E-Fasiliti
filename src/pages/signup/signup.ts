import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

//import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

//import { UploadPage } from  '../upload/upload';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  confirmPassword: string;
  
  account: { name: string, email: string, phone: string, address: string, building: string, role: string } = {
    name: '',
    email: '',
    phone: '',
    address: '',
    building: '',
    role: ''
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public firebaseProvider: FirebaseProvider,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  back(){
    //this.navCtrl.pop();
    this.viewCtrl.dismiss();
  }

  doSignup() {
    // Attempt to login in through our User service
    let loader = this.loadingCtrl.create({
      spinner: "circles"
    });

    let alert = this.alertCtrl.create({
      title: 'User Registration',
      subTitle: 'User registration is successful',
      buttons: ['OK']
    });

    loader.present();
    
    this.firebaseProvider.signUp(this.account).then( _ => {

      //this.navCtrl.push(UploadPage); // TODO: Remove this when you add your signup endpoint
      loader.dismiss();
      alert.present();

    }).catch(err=>{
      //nothing
    })

    // this.user.signup(this.account).subscribe((resp) => {
    //   this.navCtrl.push(UploadPage);
    //   loader.dismiss();
    // }, (err) => {

    //   this.navCtrl.push(UploadPage); // TODO: Remove this when you add your signup endpoint

    //   loader.dismiss();
    //   // Unable to sign up
    //   // let toast = this.toastCtrl.create({
    //   //   message: this.signupErrorString,
    //   //   duration: 3000,
    //   //   position: 'top'
    //   // });
    //   // toast.present();
    // });
  }
}
