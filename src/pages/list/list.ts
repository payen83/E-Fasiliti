import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DetailsPage } from '../details/details';
import { SignupPage } from '../signup/signup';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  items1: FirebaseListObservable<any>;
  items2: Array<any>;

  constructor(public firebaseProvider: FirebaseProvider, public modalCtrl: ModalController, public navCtrl: NavController, afDB: AngularFireDatabase) {
    this.items1 = afDB.list('/reports');

    console.log(this.items1)
    let user = {name: "ferdy", phone: "+60192344333", email: "ferdy@gmail.com"}

    this.items2 = [
      {description: "ini adalah des", building: "building", datetime: 1502420171225, respondant: 'Maslan', user: user },
      {description: "ini adalah des", building: "building2", datetime: 1502420171225, respondant: 'none', user: user }
    ]
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ListPage');
  }

  logout(){
    this.firebaseProvider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  openDetails(item: any, key: any){
  	this.navCtrl.push(DetailsPage, {
      items: item,
      key: key
    });
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

  registerUser(){
    let modal = this.modalCtrl.create(SignupPage);
    modal.present();
  }

  getButton(item: any){

    let timeLapsed = Number(item.respondtime) - Number(item.datetime);

    //console.log(Number(timeLapsed/60000));

    const expiredTime = 1800000 // 1.8m ms = 30minutes

    if(item.respondant != 'none'){
      if(timeLapsed > expiredTime){
        return 'secondary';
      } else{
        return 'primary';
      }
      
    } else{
      return 'danger';
    }
  }


}
