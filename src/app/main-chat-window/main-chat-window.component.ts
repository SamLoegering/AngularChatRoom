import { Component, OnInit, ViewChild } from '@angular/core';
import { DBChatServiceService } from '../dbchat-service.service';
import { AngularFirestore } from "@angular/fire/firestore";
import { message } from '../message';
export type EditorType = 'displayLogin' | 'displayChat' ;
import { Bot } from '../bot';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { WeatherserviceService } from '../weatherservice.service';


@Component({
  selector: 'app-main-chat-window',
  templateUrl: './main-chat-window.component.html',
  styleUrls: ['./main-chat-window.component.css']
})
export class MainChatWindowComponent implements OnInit {
  editor: EditorType = 'displayLogin'; // defaults to show the login screen.
  @ViewChild('messageInput') inputMessageTB2; // accessing the reference element
  location: string = 'fargo';
  locations: any[] = [];
loc: message[] = [];
  arr: message[] = [];
  inputName: string;
  showAddBot = false;
  bots: Bot[] = [];

  constructor(private chatService: DBChatServiceService,private firestore: AngularFirestore, private weatherService: WeatherserviceService) {
   
   }

  ngOnInit( ) {this.chatService.getMessages().subscribe(
    (mess: message[]) => {
      this.arr = mess;
    }
  );
    this.addLocationsToArray();
    
  this.chatService.getBots().subscribe(data =>{
    this.bots = data;
  })
  this.locations = this.weatherService.locations;
  this.location = this.weatherService.location;
  this.locdata = this.weatherService.single;
  this.id = this.weatherService.id;
  this.message = this.weatherService.message;
  }
  delete(){
    this.chatService.deleteAll();
    this.locations.splice(0,this.locations.length);
  }

  addBotButton(){
    this.showAddBot = !this.showAddBot;
  }

   sendMessage(inputMesFromButton){
    const currentDate: number = Date.now();
    this.update(inputMesFromButton);
   // resolve the adding of message to the database before clearing the chat box window.
   // this requires using two different variable names one sent in from the button and another for clearing.
   // I do not understand why, but even with using a promise if you use the same variable for both it does not work.
    Promise.resolve(this.chatService.addMessageToDB(currentDate,this.inputName,inputMesFromButton)).then(function() {
    });
    this.inputMessageTB2.nativeElement.value = '';
    
  }

  selectUserName(userNameInput: string){
    if (userNameInput.length > 0){
    this.inputName=userNameInput;
    this.toggleEditor("displayChat");
  }else{
      alert("Please enter a non blank username.")
      }
    }
  logout(){
    this.toggleEditor("displayLogin");
    this.inputName="";
  }

  toggleEditor(type: EditorType) { // this is what we use to send in a message to change from login screen to chat screen or vice versa
    this.editor = type;
  }

  get displayLoginEditor() {
    return this.editor === 'displayLogin';
  }

  get displayChat() {
    return this.editor === 'displayChat';
  }
  //parse string and set location as that string
  update(str: string)
  {
  this.weatherService.update(str);
  }

  parseInput(str: string)
  {
    let s = "";
   
   if(str.includes("!weather")){
     s = str.substring(8,str.length);
    
   }
   return s;
  }
  //store the location in the DB
  addLocationToDB(str: string) {
  this.weatherService.addLocationToDB(str);
  }

  locdata: any;
  message: string = "";
  id: string = '';
  isEdit: Boolean = false;;
  switchToEditScrn()
  {
    this.isEdit = !this.isEdit;
  }

  onQuery(str: string)
  {
    if (!str) {
      this.message = 'Cannot be empty';
      this.locdata = null;
    } else {
      this.firestore.collection('Location', ref => ref.where("Location", "==", str)).get()
        .subscribe(ss => {
          if (ss.docs.length === 0) {
            this.message = 'Document not found! Try again!';
            this.locdata = null;
          } else {
            ss.docs.forEach(doc => {
              this.message = '';
              this.locdata = doc.data();
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
  deleteMe() {
    if (confirm('Delete?')) {
      this.firestore.collection('Location').doc(this.id).delete();
      this.locdata = null;
  }
  }
 
  addLocationsToArray()
  {
    this.firestore.collection('Location').get().toPromise().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
         // console.log(doc.id, " => ", doc.get('Location'));
          var loc = doc.get('Location');      
          this.locations.push(loc);
          console.log(this.locations[0] + "Hit me")
      });
  });
    
  }

  edit()
  {
     this.firestore.collection('Location').doc(this.id);
     
  }
deleteAll()
{
this.locations = [];
}



}

