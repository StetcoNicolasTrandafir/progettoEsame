import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../service/http.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  id:number;
  infoUtente;
  username: any;
  password: any;
  confermaPassword: any;
  nome: any;
  cognome: any;
  sesso: any;
  dataNascita: any;
  mail: any;
  descrizione: any;
  errore: any;
  vecchiaPassword: any;
  nuovaPassword: any;

  constructor(private activatedRoute:ActivatedRoute,private http:HttpService, private pipe:DatePipe) {
    activatedRoute.params.subscribe(
      (params)=>{
        console.log(params);
        this.id=params.id;
      }
    )
  }

  ngOnInit() {
    this.http.sendPOSTRequest('/user/getUser',{}).subscribe(
      (data)=>{
        console.log(data.data[0]);
        this.infoUtente=data.data[0];
        this.sesso=this.infoUtente.sesso;
        this.username=this.infoUtente.username;
        this.cognome=this.infoUtente.cognome;
        this.nome=this.infoUtente.nome;
        this.mail=this.infoUtente.mail;
        this.dataNascita=this.infoUtente.dataNascita;
        this.descrizione=this.infoUtente.descrizione;
      },(err)=>{
        console.log(err);
      }
    )
  }

  changeInfo() {

    if(this.username==""){
      this.errore="Inserire uno username";
    }else if(this.username.length>=30||this.username.length<=5){
      this.errore="Lo username deve essere lungo dai 5 ai 30 caratteri";
    }else if(this.username.includes(' ')){
      this.errore="Lo username non deve contenere spazi vuoti";
    }else if(this.nome==""){
      this.errore="Inserire un nome";
    }else if(this.nome.length<=2||this.nome.length>=30){
      this.errore="Il nome deve essere lungo dai 2 ai 30 caratteri";
    }else if(this.cognome==""){
      this.errore="Inserire un cognome";
    }else if(this.cognome.length<=2||this.nome.length>=30){
      this.errore="Il cognome deve essere lungo dai 2 ai 30 caratteri";
    }else if(this.dataNascita==null){
      this.errore="Inserire una data di nascita";
    }else if(this.mail==""){
      this.errore="Inserire una mail";
    }
    else{
      let param={
        user:this.username,
        mail:this.mail,
        descrizione:this.descrizione
      }
      console.log(param);
      this.http.sendPOSTRequest("/user/updateUser", param).subscribe(
        (data) => {
            console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  changePassword() {
    if(this.nuovaPassword==this.confermaPassword&&this.nuovaPassword.length>=8){
      let param={
        oldPassword:this.vecchiaPassword,
        newPassword:this.nuovaPassword
      }
      this.http.sendPOSTRequest('/user/changePassword',param).subscribe(
        (data)=>{
          console.log(data);
        },err=>{
          console.log(err);
        }
      )
    }

  }
}
