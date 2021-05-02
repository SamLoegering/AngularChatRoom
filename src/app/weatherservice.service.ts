import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DBChatServiceService } from './dbchat-service.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherserviceService {

  location: string = 'fargo';
  locations: any[] = [];
  inputName: string;
  showAddBot = false;
  constructor(private firestore: AngularFirestore,private chatService: DBChatServiceService) { }
  ngOnInit( ) {
    //this.addLocationsToArray();
  }
  update(str: string)
  {
   let s = "";
   
   if(str.includes("!weather")){
     s = str.substring(8,str.length);
     this.location = s; 
     this.locations.push(s);
     console.log("added" + s)
     console.log(this.locations[0])
     this.addLocationToDB(s);
   }
  }
  //store the location in the DB
  addLocationToDB(str: string) {

var citiesRef = this.firestore.collection("Location");

citiesRef.doc().set({
    Location: str
   });

  }
  single: any;
  message: string = "";

  id: string = '';
  onQuery(str: string)
  {
    if (!str) {
      this.message = 'Cannot be empty';
      this.single = null;
    } else {
      this.firestore.collection('Location', ref => ref.where("Location", "==", str)).get()
        .subscribe(ss => {
          if (ss.docs.length === 0) {
            this.message = 'Document not found! Try again!';
            this.single = null;
          } else {
            ss.docs.forEach(doc => {
              this.message = '';
              this.single = doc.data();
            })
          }
        })
    }
    const docRef = this.firestore.collection('Location', ref => ref.where("Location", "==", str)); //looks for same id
    docRef.snapshotChanges().forEach((changes) => {
      changes.map((a) => {
        this.id = a.payload.doc.id;
      });
    });
    
  }
 
 
 

}
