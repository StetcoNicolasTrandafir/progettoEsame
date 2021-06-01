import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  errore: any;
  descrizione: any;
  mail: any;
  username: any;
  infoUtente;
  errorePassword: any;
  confirmPwd: any;
  newPwd: any;
  oldPwd: any;

  constructor(private router:Router,private http:HttpService,private activeroute:ActivatedRoute) {
    activeroute.params.subscribe(
      (data)=>{
        this.http.sendPOSTRequest('/user/getUser',{}).subscribe(
          (data)=>{
            console.log(data);
            this.infoUtente=data.data[0];
            this.username=this.infoUtente.username;
            this.descrizione=this.infoUtente.descrizione;
            this.mail=this.infoUtente.mail;

          },(err)=>{
            console.log(err);
          }
        )
      }
    )
  }

  ngOnInit() {

  }

  goBack() {
    this.router.navigate(['tabs/tab3']);

  }

  saveInfo() {
    //CONTROLLO VALORI
    if(this.username.length>=30||this.username.length<=5){
      this.errore="Lo username deve essere lungo dai 5 ai 30 caratteri";
    }else if(this.mail.length<4){
      this.errore="Inserire una mail";
    }else{
      //CAMBIA INFO
      this.http.sendPOSTRequest('/user/updateUser',{user:this.username,mail:this.mail,descrizione:this.descrizione}).subscribe(
        (data)=>{
          console.log(data);
          this.errore=data.data;
          if(data.token){
            localStorage.setItem('token',data.token);
          }
        },(err)=>{
          console.log(err);
        }
      )
    }
  }

  changePwd() {
    alert();
    //CONTROLLO PASSWORD VECCHIA
    if(this.newPwd!=this.confirmPwd){
      this.errorePassword="La due password non coincidono";
    }else{
      this.http.sendPOSTRequest('/user/changePassword',{oldPassword:this.oldPwd,newPassword:this.confirmPwd}).subscribe(
        data=>{
          console.log(data);
          this.errorePassword=data.data;
        },err=>{
          console.log(err);
        }
      )
    }
  }
}
