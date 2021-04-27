import { Component, OnInit } from '@angular/core';
import {HttpClient , HttpHeaders} from '@angular/common/http';
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
      //this.errore="bravissimo";
      console.log(this.user, this.password);


      const headers = new HttpHeaders().set('Content-Type','application/json');


      this.sendPostRequest("/api/login", JSON.stringify({mail:this.user,password:this.password}), headers).subscribe(
        (data: any) => {
          console.log(data);
          if(typeof(data.data)!="string"){
            this.errore="Login effettuato";
            localStorage.setItem("token","Beaer "+data.token);
          }
          else
            this.errore="Credenziali errate";


        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  public sendPostRequest(servizio: string, datiBody:any, header:any) {
    console.log(header);
    //TODO aggiungere il token all'header nelle chiamate
    return this.http.post(this.ENDPOINT_SERVER + servizio, datiBody, {headers: header});
  }
}
