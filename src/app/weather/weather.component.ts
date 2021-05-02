import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DBChatServiceService } from '../dbchat-service.service';
import { WeatherserviceService } from '../weatherservice.service';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  @Input() location: string = '';
  locdata: any;
  locations: any[] = [];
  constructor(private chatService: DBChatServiceService,private firestore: AngularFirestore,private weatherService: WeatherserviceService) { }
  WeatherData: any;
  tempp: any;
  name: string = "";
  id: any;
  ngOnInit(): void {
    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData();
    this.weatherService.single = this.locdata;
    this.locations = this.weatherService.locations;
  }
  
  ngOnChanges()
  {
    this.WeatherData = {
      main : {},
      isDay: true
    }; 
    this.getWeatherData();   
  }

  getWeatherData()
  {
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+this.location+'&appid=ff1bc4683fc7325e9c57e586c20cc03e')
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})

  }

  setWeatherData(data)
  {let n = '';
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.tempp = (1.8*(this.WeatherData.main.temp - 273)+32).toFixed(0);
    this.WeatherData.temp_min = (1.8*(this.WeatherData.main.temp_min - 273)+32).toFixed(0);
    this.WeatherData.temp_max = (1.8*(this.WeatherData.main.temp_max - 273)+32).toFixed(0);
    this.WeatherData.temp_feels_like = (1.8*(this.WeatherData.main.feels_like - 273)+32).toFixed(0);
    this.name = this.WeatherData.name;
    this.name = this.name.toLowerCase();
    n = this.location;
    var numberValue = Number(this.tempp);
  }
 
  del(item: string)
  {
    let s = item.toLowerCase();
    console.log(s + "item");
    let c = 0;
    for (let i = 0; i < this.locations.length; i++) {
      if(this.locations[c]===this.location)
      {console.log(this.locations[c])
        this.locations.splice(c,1);
        console.log(this.locations[c])
        
        c++;
        break;
      }
    }
  const docRef = this.firestore.collection('Location', ref => ref.where("Location", "==", s)); //looks for same id
    docRef.snapshotChanges().forEach((changes) => {
      changes.map((a) => {
        this.id = a.payload.doc.id;
        this.firestore.collection('Location').doc(this.id).delete();
      });
    });
    
  console.log(this.name + "deleted");
  this.locdata = null;
  }
  getBackgroundColor(b: Boolean) {
    let color = 'orange';
    if (b) {
     color = 'linear-gradient(180deg, rgb(195, 3, 3) 0%, rgb(10, 7, 92) 75%, rgb(8, 10, 63) 100%)';
    } else{
      color = 'linear-gradient(180deg, rgb(243, 2, 2) 0%, rgb(197, 77, 77) 75%, rgb(223, 191, 9) 100%)';
    }
    return color;
  }
  
  
}
