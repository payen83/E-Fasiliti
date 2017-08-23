import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { PhotosPage } from '../photos/photos';
import { LoginPage } from '../login/login';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the DetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  items: any;
  date: any;
  time: any;
  account: any;
  key: any;

  constructor(public firebaseProvider: FirebaseProvider, public callNumber: CallNumber, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.items = this.navParams.get('items');
    this.key = this.navParams.get('key');
    //console.log(this.key);
    let datetime = new Date(this.items.datetime);
    //Fri Aug 11 2017 10:42:00 GMT+0800 (+08)
    this.date = datetime.toString().substring(4,15);
    this.time = datetime.toString().substring(16,21);

    this.account = JSON.parse(localStorage.getItem('USER'));

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetailsPage');
  }

  openImages(){
  	//this.navCtrl.push(PhotosPage);
  	let modal = this.modalCtrl.create(PhotosPage, {images: this.items.images});
    modal.present();
  }

  makeCall(){
  	let confirm = this.alertCtrl.create({
      title: 'Buat panggilan pada pengadu?',
      message: '',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Teruskan',
          handler: () => {
            this.dial();
          }
        }
      ]
    });
    confirm.present();
  }

  dial(){

    this.callNumber.callNumber(this.items.user.phone, true)
    .then(() => this.firebaseProvider.setRespondant(this.account, this.key))
    .catch(() => console.log('Error launching dialer'))

    //this.firebaseProvider.setRespondant(this.account, this.key);
      
  }

  getRespondant(respondant: any){
    return respondant != 'none';
  }

  logout(){
    this.firebaseProvider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
