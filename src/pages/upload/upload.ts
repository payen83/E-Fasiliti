import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { ReportPage } from '../report/report';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import * as firebase from 'firebase/app';
declare var window: any;

/**
 * Generated class for the UploadPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  image6: any;

  imageUpload1: any;
  imageUpload2: any;
  imageUpload3: any;
  imageUpload4: any;
  imageUpload5: any;
  imageUpload6: any;


  imageArray: Array<any>;

  constructor(public loadingCtrl: LoadingController, public firebaseProvider: FirebaseProvider, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public camera: Camera) {
    let defaultImg: string = 'assets/img/camera.png'

    this.image1 = defaultImg;
    this.image2 = defaultImg;
    this.image3 = defaultImg;
    this.image4 = defaultImg;
    this.image5 = defaultImg;
    this.image6 = defaultImg;
    this.imageArray = [];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad UploadPage');
  }

  nextPage(){

    //alert('upload');

    let loader = this.loadingCtrl.create({
      spinner: 'circles'
    })

     loader.present()

    //this.beginUpload(this.imageUpload1);

    this.pushImages().then((imageArray)=>{
      loader.dismiss();
      //alert(imageArray);
      this.navCtrl.push(ReportPage, {
        images: imageArray
      }); 

    })
    	
  }

  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadToFirebase(_imageBlob: any, fileName: string) {
    //var fileName = 'sample-' + new Date().getTime() + '.jpg';
    let length = fileName.length-2
    let folderName =fileName.substring(0,length);
    fileName = fileName+'.jpg';

    //alert(fileName)

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref(folderName+'/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', {next :function (_snapshot) {
         console.log('snapshot progess ' + _snapshot);
      }, error: function (_error) {
         reject(_error);
      }, complete: function () {
         resolve(uploadTask.snapshot);
      }});

    });
  }

  beginUpload(image: any, fileName: any): Promise<any>{

    return new Promise((resolve,reject)=>{

      this.makeFileIntoBlob(image).then(imageBlob=>{
            //alert('imageBlob: ' + JSON.stringify(imageBlob));

            this.uploadToFirebase(imageBlob, fileName).then((_uploadSnapshot: any) => {

              //alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);
              let imageData = {
                name: _uploadSnapshot.metadata.name,
                URL: _uploadSnapshot.downloadURL
              };

              resolve(imageData);
            }).catch(err=>{
              alert('Error: '+JSON.stringify(err));
              reject(err);
            })

      })

    })

  }

  pushImages(): Promise<any>{

    return new Promise((resolve, reject) => {
      let datetime = (new Date()).getTime();
      let fileName: any

      if(this.imageUpload1){

         fileName = datetime + '-1';

         this.beginUpload(this.imageUpload1, fileName).then(downloadURL1 => {
           this.imageArray.push(downloadURL1);

           if (this.imageUpload2){
             
             fileName = datetime + '-2';  

             this.beginUpload(this.imageUpload2, fileName).then(downloadURL2 => {
               this.imageArray.push(downloadURL2);

               if (this.imageUpload3){
                 
                 fileName = datetime + '-3';  

                 this.beginUpload(this.imageUpload3, fileName).then(downloadURL3 => {
                   this.imageArray.push(downloadURL3);

                   if (this.imageUpload4){
                     
                     fileName = datetime + '-4';  

                     this.beginUpload(this.imageUpload2, fileName).then(downloadURL4 => {
                       this.imageArray.push(downloadURL4);

                       if (this.imageUpload5){
                         
                         fileName = datetime + '-5';  

                         this.beginUpload(this.imageUpload5, fileName).then(downloadURL5 => {
                           this.imageArray.push(downloadURL5);

                            if (this.imageUpload6){
                               
                               fileName = datetime + '-6';  

                               this.beginUpload(this.imageUpload6, fileName).then(downloadURL6 => {
                                 
                                 this.imageArray.push(downloadURL6);
                                 resolve(this.imageArray);
                 
                               })
                             } else {
                               resolve(this.imageArray);
                             }
                           
                         })

                       } else{
                         resolve(this.imageArray);
                       }
                       
                     })
                   } else {
                     resolve(this.imageArray);
                   }
                   
                 })
               } else {
                 resolve(this.imageArray);
               }

             })
           } else {
             resolve(this.imageArray);
           }

         })
        
      } else {
        resolve(this.imageArray);
      }

    })
  }

  chooseSource(img: string){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload your picture via..',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.takePhotos('camera', img);
          }
        },{
          text: 'Photo Album',
          handler: () => {
            this.takePhotos('album', img);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();

  }

  takePhotos(source: string, img: string){
    let options: CameraOptions;

    //FILE_URI => this.camera.DestinationType.FILE_URI
    //DATA_URL => this.camera.DestinationType.DATA_URL;

    let destination = this.camera.DestinationType.FILE_URI;

    if (source == 'camera'){

      options = {
        quality: 20,
        destinationType: destination,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: false,
        correctOrientation: true
      } 

    } else {

      options = {
        quality: 20,
        destinationType: destination,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        allowEdit: false,
        correctOrientation: true
      } 
        
    }

    this.camera.getPicture(options).then((imageData) => {
     
     //let data = 'data:image/jpeg;base64,' + imageData

     const newImage = imageData;


     switch (img) {
       case "1":
         // code...
         this.image1 = newImage;
         this.imageUpload1 = newImage;
         break;

       case "2":
         this.image2 = newImage;
         this.imageUpload2 = newImage;
          break;

       case "3":
         this.image3 = newImage;
         this.imageUpload3 = newImage;
         break;

       case "4":
         // code...
         this.image4 = newImage;
         this.imageUpload4 = newImage;
         break;

       case "5":
         this.image5 = newImage;
         this.imageUpload5 = newImage;
          break;

       case "6":
         this.image6 = newImage;
         this.imageUpload6 = newImage;
         break;
       
       default:
         break;
     }

    }, (err) => {
      alert(err);
    });
  }

  logout(){
    this.firebaseProvider.logout();
  	this.navCtrl.setRoot(LoginPage);
  }

}
