import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainChatWindowComponent } from './main-chat-window/main-chat-window.component';
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { AddBotComponent } from './add-bot/add-bot.component';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    MainChatWindowComponent,
    AddBotComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }