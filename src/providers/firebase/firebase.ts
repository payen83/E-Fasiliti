import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase/app';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  user: Observable<firebase.User>;
  imageList: Array<any>;

  constructor(public afAuth: AngularFireAuth, public http: Http, public afDB: AngularFireDatabase) {
    this.user = afAuth.authState;
  }

  submitReport(report: any, account: any, images: any): Promise<any>{

  	return new Promise(resolve => {
	  	let reportRef = firebase.database().ref('reports/');

		let newReport = reportRef.push();

		let user = account;

			newReport.set({
				user: user,
				description: report.description,
				building: report.building,
				datetime: report.datetime,
				respondtime: report.datetime,
				images: images,
				respondant: 'none'
			});

			resolve('success')

	  	})

  }

  login(account: any): Promise<any>{
  	return new Promise(resolve=>{

  		this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password).then(data => {
			//console.log(JSON.stringify(data))
			//let userRef = firebase.database().ref('user/');

			// let newUser = userRef.push();

			// newUser.set({
			// 	email: account.email,
			// 	name: account.name,
			// 	phone: account.phone
			// });

			// console.log(newUser.key)

			resolve('success');

		}).catch((err) => {

			let error: any = err;
			let errorCode = error.code;
			let errorMessage = error.message;

			if (errorCode === 'auth/wrong-password') {
				//alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
  			
  			console.log(error);

			resolve(errorCode);
		  	
		});

  	})
  }

  getUser(account: any){
 //  	const queryObservable = this.afDB.list('/user', {
	//   query: {
	//     orderByChild: 'email',
	//     equalTo: account.email
	//   }
	// });

	var ref = firebase.database().ref("users");
	ref.orderByChild("email").equalTo(account.email).on("child_added", function(snapshot) {
	  let account = JSON.stringify(snapshot.val());
	  //console.log('result: '+JSON.stringify(snapshot.val()));
	  localStorage.setItem('USER', account); 
	});

  	//console.log('user details:' + JSON.stringify(queryObservable));

  	//localStorage.setItem('USER', JSON.stringify(this.account)); 

  }

  checkUser(account:any): Promise<any>{
  	return new Promise((resolve,reject)=>{
  		//console.log('begin')
	  	var ref = firebase.database().ref("users");
		ref.orderByChild("email").equalTo(account.email).on("child_added", 
		function(snapshot) {
		  let account = snapshot.val();
		  //console.log('account ok ' + account);
		  if(account.role=='user'){
		  	//console.log('case1')
		  	resolve('invalid')
		  } else {
		  	//console.log('case2')
		  	resolve('valid')
		  }
		})
  	})

  }

  setRespondant(admin: any, key: any){
    let updates = {};
    let respondTime = (new Date()).getTime();

    this.getReportDetail(key).then(report=>{

	    let postData = {
	    	building: report.building,
	    	datetime: report.datetime,
	    	respondtime: respondTime,
	    	description: report.description,
	      	respondant: admin.name,
	      	user: report.user
	    };

	    updates['reports/' + key] = postData;
	    firebase.database().ref().update(updates);
    
    })
  }

  getReportDetail(key: any): Promise<any>{

  	return new Promise(resolve=>{
  		firebase.database().ref('/reports/' + key).once('value').then(snapshot => {
		  //var username = snapshot.val().username; 
		  resolve(snapshot.val());
		});
  	})

  }

  uploadPictures(key: any, images: Array<any>): Promise<any>{

  	// const storageRef = firebase.storage().ref().child(''+key+'/'+key+'-1.png');
  	// storageRef.getDownloadURL().then(url=>{
  	// 	let image = url;
  	// })

  	this.imageList = [];

  	return new Promise(resolve => {

	  	for (let image of images){

	  		if (image != null) {

	  			this.beginUpload(image, key).then((savedPicture)=>{
	  				this.imageList.push(savedPicture);
	  			})
			}

	  	}

	  	resolve(this.imageList);

  	})

  }

  beginUpload(image: any, key: any): Promise<any>{
  	return new Promise(resolve => {
  		//alert(image);
  		alert(key+'-1.jpg');

  // 		let metadata = {
		//   contentType: 'image/jpeg',
		// };

		let storageRef = firebase.storage().ref('images/photo.jpg');
		let task = storageRef.put(image);

		task.on('state_changed', 

			function progress(snapshot){
				//alert(snapshot.);
			},

			function error(err){
				alert(error.toString());
			}

		);

		// Upload the file and metadata
		// storageRef.child('images/photo.jpg').putString(image, 'base64', metadata).then(savedPicture=>{
		// 	alert(savedPicture.downloadURL);
		// 	resolve(savedPicture.downloadURL);
		// }).catch(error=>{
		// 	alert(error);
		// 	resolve()
		// })

	 //  	firebase.storage().ref('/images/').child(key)
		// .child(key+'-1.jpg')
		// .putString(image, 'base64', {contentType: 'image/jpg'}) //.putString(image, 'base64')
		// .then((savedPicture) => {
		// 	//this.imageList.push(savedPicture.downloadURL);
		// 	resolve(savedPicture.downloadURL)
		// })
		// .catch(error=>{
		// 	alert(error);
		// 	resolve()
		// })

		// let storageRef = firebase.storage().ref();
	 //    let imageName = key+'-1';
	 //    let imageRef = storageRef.child(key+'/'+ imageName +'.jpg');
	 //    imageRef.putString(image, 'data_url').then(savedPicture=>{
	 //    	resolve(savedPicture.downloadURL);
	 //    });

		//resolve();

  	})

  }

  signUp(account: any): Promise<any>{

  	return new Promise(resolve=>{

		//this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password).then(data => {
			//console.log(JSON.stringify(data))
			let userRef = firebase.database().ref('users/');

			let newUser = userRef.push();

			let user = account;
			//user.role = role;

			newUser.set(user);

			//console.log(newUser.key)

			resolve();
		//}).catch((error) => {
			//resolve();
		  	//console.log(JSON.stringify(error))
		//});

  	})

  }

  logout(): Promise<any>{
  	return new Promise(resolve=>{
  		this.afAuth.auth.signOut();
  	})
  }

}
