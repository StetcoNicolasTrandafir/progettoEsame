import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private ENDPOINT_SERVER = "http://localhost:1337";
  errore:string="";
  password:string="";
  user:string="";
  loginResult:any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  login() {
    if(this.user=="")
      this.errore="Inserisci l'username o l'indirizzo e-mail";
    else if(this.password=="")
      this.errore="Inserisci la password";
    else{

      this.errore="bravissimo";
      this.sendPostRequest("/api/login",{mail:this.user,password:this.password}).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  public sendPostRequest(servizio: string, datiBody:any) {
    return this.http.post(this.ENDPOINT_SERVER + servizio, datiBody);
  }
}
