import { Component, OnInit } from '@angular/core';
import {Capacitor,Plugins} from '@capacitor/core';
import {HttpService} from "../service/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  latitudine:number;
  longitudine:number;
  user: any="pengu@gmail.com";
  password: any="gino";
  errore: any;

  constructor(private http:HttpService,private router:Router) { }

  ngOnInit() {

  }

  getPosition(){
      if(!Capacitor.isPluginAvailable('Geolocation')){
        alert("No plugin");
      }else{
        Plugins.Geolocation.getCurrentPosition().then(geoposition=>{
          this.latitudine = geoposition.coords.latitude;
          this.longitudine = geoposition.coords.longitude;
        })
        .catch(err=>{
          alert("Errore");
        });
      }
    }

  login() {
    if(this.user==""){
      this.errore="Inserisci username o indirizzo mail";
    }else if(this.password==""){
      this.errore="Inserisci password";
    }else{
      this.http.sendPOSTRequest("/api/login",{mail:this.user,password:this.password}).subscribe(
        (data)=>{
          if(typeof (data.data)!="string"){
            localStorage.setItem("token",data.token);
            this.router.navigateByUrl('');
          }else{
            this.errore="Crenziali errate";
          }
        },
        (error)=>{
          console.log(error);
          this.errore="Crenziali errate";
        }
      );
    }
  }
}
