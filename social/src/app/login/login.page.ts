import { Component, OnInit } from '@angular/core';
import {Capacitor,Plugins} from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  latitudine:number;
  longitudine:number;

  constructor() { }

  ngOnInit() {
    this.getPosition();
  }

  getPosition(){
      if(!Capacitor.isPluginAvailable('Geolocation')){
        alert("No plugin");
      }else{
        Plugins.Geolocation.getCurrentPosition().then(geoposition=>{
          this.latitudine = geoposition.coords.latitude;
          this.longitudine = geoposition.coords.longitude;
          //alert(this.latitudine);
          //alert(this.longitudine);
        })
        .catch(err=>{
          alert("Errore");
        });
      }
    }
}
