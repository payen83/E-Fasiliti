import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { User } from '../../providers/user';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { TranslateService } from '@ngx-translate/core';

import { ListPage } from  '../list/list';

/**
 * Generated class for the AdminLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-login',
  templateUrl: 'admin-login.html',
})
export class AdminLoginPage {

  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    public firebaseProvider: FirebaseProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AdminLoginPage');
  }


  back(){
    this.navCtrl.pop();
  }

  doLogin() {

    let loader = this.loadingCtrl.create({
      spinner: "circles"
    });

    loader.present();

    this.firebaseProvider.login(this.account).then(data=>{

      loader.dismiss();

      if(data=='success'){

          this.firebaseProvider.checkUser(this.account).then(valid=>{
            console.log(valid);
            if(valid=='valid'){
              this.firebaseProvider.getUser(this.account);
              this.navCtrl.push(ListPage);
            } else{
              alert('user is not allowed to login')
            }

          }).catch(err=>{
              console.log(err)
              alert('user is not allowed to login')

          });

      } else{
        if(data=='auth/wrong-password'){
          alert('Username or password invalid');

         } else{
             alert('Error Login: '+data);
         }        
      }
    })

  }

    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(ListPage);
    //   loader.dismiss();
    // }, (err) => {
    //   this.navCtrl.push(ListPage);
    //   loader.dismiss();
      // Unable to log in
      // let toast = this.toastCtrl.create({
      //   message: this.loginErrorString,
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
  //   });
  // }

}
