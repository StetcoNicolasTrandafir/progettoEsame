import { Component, OnInit } from '@angular/core';
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



  login() {
    if(this.user==""){
      this.errore="Inserisci username o indirizzo mail";
    }else if(this.password==""){
      this.errore="Inserisci password";
    }else{
      this.http.sendPOSTRequest("/user/login",{mail:this.user,password:this.password}).subscribe(
        (data)=>{
          if(data.data){
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

  signup() {
    this.router.navigateByUrl('signup');
  }
}
