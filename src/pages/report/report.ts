import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ConfirmationPage } from '../confirmation/confirmation';
import { LoginPage } from '../login/login';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ReportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  images: Array<any>;

  account: {name: string, email: string, phone: string, building: string} = {name: '', email: '', phone: '', building: ''};
  report: {description: string, datetime: number, building: string} = {description: '', datetime: 0, building: ''};

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public firebaseProvider: FirebaseProvider) {
    let date = new Date();
    this.images = this.navParams.get('images');
    this.report = { description: undefined, datetime: date.getTime(), building: undefined };
    this.account = { name: undefined, email: undefined, phone: undefined, building: undefined };
  }

  ionViewDidLoad() {
     this.account = JSON.parse(localStorage.getItem('USER'));   
     this.report.building = this.account.building; 
  }

  nextPage(){
    let loader = this.loadingCtrl.create({
      spinner: "circles"
    });

    loader.present();
    //let key = new Date().getTime();

    //alert('this images: ' + JSON.stringify(this.images));

    //this.firebaseProvider.uploadPictures(key, this.images).then( imageList => {
      //alert('imageList: '+JSON.stringify(imageList));
      this.firebaseProvider.submitReport(this.report, this.account, this.images).then(data=>{
        loader.dismiss();

        if (data == 'success'){
          this.navCtrl.push(ConfirmationPage, {
            item: this.report
          });
        } else {

        }
      })

    //})

    
  }

  logout(){
    this.firebaseProvider.logout();
  	this.navCtrl.setRoot(LoginPage);
  }



}
