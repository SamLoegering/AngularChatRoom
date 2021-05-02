import { Injectable, ViewChild } from '@angular/core';
import {message} from './message'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bot } from './bot';

@Injectable({
  providedIn: 'root'
})
export class DBChatServiceService {
  collectionPath= 'chatlog';

  messages: Observable<message[]>;
  
  bots: Bot[] = [];

  constructor(private firestore: AngularFirestore, private http: HttpClient ) {   
    // What this line does is subscribes the message array observable to the 
    // firestore which acts as an observable emiting whenever .valuechanges calls. 
    // The .pipe map sorting thing sorts the information from the database in chronological order so that messages
    // are displayed  ordered by the time they arrived. 
    // by default firebases are not sorted so we need to sort the data from the database when it arrives in our code
    // in this spot here.
    
    this.messages=this.firestore.collection<message>(this.collectionPath).valueChanges().pipe(map(ev => ev.sort(function(a, b) {
      return a.date - b.date;
    })))
   
  }

  ngOnInit(): void {
    this.getBots();
  }

  addBot(newBot: Bot) {
    return this.http.post('https://add-bot-372ed-default-rtdb.firebaseio.com/' + 'bot.json', newBot);
  }

  getBots() {
    return this.http.get<Bot[]>('https://add-bot-372ed-default-rtdb.firebaseio.com/' + 'bot.json')
    .pipe(map(responseData =>{
      const botArray: Bot[] = [];

      for(let key in responseData){
        botArray.push(responseData[key]);
      }
      this.bots = botArray;
      return botArray;
    }))
  }

  addMessageToDB(inputDate: number, inputUserName: string, inputMessage: string) {
   this.firestore.collection<message>(this.collectionPath).add({
    date: inputDate,
    userName: inputUserName,
    message: inputMessage
   });
   
   /** After a message is sent this checks what was said and does a bot response using a switch. The reason for the
    * setTimeout delay is if you do it at the same time sometimes the bots response shows up before the person message in the
    * array. If the message is one that does not detect any of the key words like !weather the switch just defaults and does nothing.
    */
   let responseMessage: string;
   let botName: string;

   for(let i=0; i< this.bots.length;i++) {
    if(inputMessage.toLowerCase() == this.bots[i].botCase.toLowerCase()){

      if(this.bots[i].botCase.toLowerCase() == "!joke"){
        responseMessage=inputUserName +" : " + jokeRandomizer();
        botName = this.bots[i].botName
        botResponseNew(this.firestore,responseMessage,botName,inputDate,this.collectionPath);
        break;
      }

    responseMessage=inputUserName +" : " + this.bots[i].botResponse;
    botName = this.bots[i].botName
    botResponseNew(this.firestore,responseMessage,botName,inputDate,this.collectionPath);
    break;
   }
 }


  
  }

  


deleteAll( ): void {
  // This code is sloppy as hell and would not work when using it on a live server, but we are just using it for 
  // debugging purposes.
  this.firestore.collection(this.collectionPath)
  .get()
  .toPromise()
  .then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    doc.ref.delete();
  });
});
this.firestore.collection('Location')
.get()
.toPromise()
.then((querySnapshot) => {
querySnapshot.forEach((doc) => {
  doc.ref.delete();
});
});

}

getMessages(){
  return this.messages;
}
deleteLocations(arr: string[])
{
  arr = [];
}

//function botResponse(botResponse: any, firestore: AngularFirestore, responseMessage: string, botName: string, inputDate: number, collectionPathInput: string) {



}




function jokeRandomizer(): string {
 const num= Math.floor((Math.random() * 3) + 1); // generates a random number 1-3
 let responseMessage: string;
 switch(num){
   case 1:
    responseMessage= ": What do you call a fake noodle? An impasta";
    return responseMessage;

   case 2:
    responseMessage=  ": What do you call an alligator in a vest? An investigator";
    return responseMessage;

    case 3:
    responseMessage=  ": What do we do with dead scientists? We barium!";
    return responseMessage;

    default:
      responseMessage= ": error in generating a joke sorry.";
      return responseMessage;
 }

}







function botResponseNew(firestore: AngularFirestore, responseMessage: string, botName: string, inputDate: number, collectionPathNew: string) {
  firestore.collection<message>(collectionPathNew).add({
    date: inputDate+1000,
    userName: botName,
    message: responseMessage
   });
}