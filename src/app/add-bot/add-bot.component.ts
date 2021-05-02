import { Component, Input, OnInit } from '@angular/core';
import { DBChatServiceService } from '../dbchat-service.service';
import { Bot } from '../bot';
@Component({
  selector: 'app-add-bot',
  templateUrl: './add-bot.component.html',
  styleUrls: ['./add-bot.component.css']
})
export class AddBotComponent implements OnInit {

  constructor(private chatService: DBChatServiceService) { } 

  ngOnInit(): void {
    this.fetchData();
  }

  botCase:string;
  botName:string;
  botResponse:string;
  bots: Bot[] = [];

  fetchData(){
    this.chatService.getBots().subscribe(data =>{
      this.bots = data;
    })
  }
  
  submitAdd(){
    const newBot: Bot = {
      botName: this.botName,
      botCase: this.botCase,
      botResponse: this.botResponse
    }

    this.chatService.addBot(newBot).subscribe(data => {
      console.log(data);
      this.fetchData();
    })
   // this.chatService.addBot(this.botName,this.botCase,this.botResponse);
  }
}
