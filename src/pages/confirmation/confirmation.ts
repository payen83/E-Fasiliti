import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UploadPage } from '../upload/upload';
import { LoginPage } from '../login/login';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ConfirmationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  item: any

  constructor(public firebaseProvider: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('item');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ConfirmationPage');
  }

  newAduan(){
  	this.navCtrl.push(UploadPage);
  }

  logout(){
    this.firebaseProvider.logout();
  	this.navCtrl.setRoot(LoginPage);
  }

  getDate(datetime: any): string{

    let mydate = new Date(datetime);
    //Fri Aug 11 2017 10:42:00 GMT+0800 (+08)
    return mydate.toString().substring(4,15);
    
  }

  getTime(datetime: any): string{
    let mydate2 = new Date(datetime);
    return mydate2.toString().substring(16,21);
  }

}
