import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../service/http.service";
import {Capacitor, Plugins} from "@capacitor/core";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  username: any="iamdias";
  password: any="ciaociao";
  nome: any="Andrea";
  cognome: any="Tomatis";
  dataNascita: Date;
  mail: any="andreatomatis02.at@gmail.com";
  descrizione: any="Sono un figo";
  errore: any;
  confermaPassword: any="ciaociao";
  sesso: any='M';
  private latitudine: number=10;
  private longitudine: number=10;
  mostrafoto: boolean=false;
  private selectedFile: File;

  constructor(private router:Router,private http:HttpService,private pipe:DatePipe) { }

  ngOnInit() {
  }

  async signup() {

    if(this.username==""){
      this.errore="Inserire uno username";
    }else if(this.username.length>=30||this.username.length<=5){
      this.errore="Lo username deve essere lungo dai 5 ai 30 caratteri";
    }else if(this.username.includes(' ')){
      this.errore="Lo username non deve contenere spazi vuoti";
    }else if(this.password==""){
      this.errore="Inserire una password";
    }else if(this.password!=this.confermaPassword){
      this.errore="Le due password non coincidono";
    }else if(this.password.length>9){
      this.errore="La password deve contenere almeno 9 caratteri";
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
    else if(!this.selectedFile){
      this.errore="Inserire una foto";
    }
    else{
      let position= await this.getPosition();
      alert(this.latitudine);
      const uploadData = new FormData();
      uploadData.append('myFile', this.selectedFile, this.selectedFile.name);

      let param={
        user:this.username,
        mail:this.mail,
        nome:this.nome,
        cognome:this.cognome,
        foto:this.selectedFile.name,
        sesso:this.sesso,
        descrizione:this.descrizione,
        dataNascita:this.pipe.transform(this.dataNascita, 'dd-MM-yyyy'),
        password:this.password,
        posizione: position
        //posizione:String(this.latitudine)+";"+String(this.longitudine)
      }
        this.http.sendPOSTRequest("/api/signup", param).subscribe(
          (data) => {
            if (data.code == 50) {
              this.errore = data.data;
            } else {
              this.http.sendPOSTRequest("/api/processUpFile", uploadData).subscribe(
                (data) => {
                  console.log(data);
                },
                (error) => {
                  console.log(error);
                }
              );
              localStorage.setItem('token', data.token);
              this.router.navigateByUrl('');
            }

          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  login() {
    this.router.navigateByUrl('login');
  }

  async getPosition(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      alert("No plugin");
    }else{
      return Plugins.Geolocation.getCurrentPosition().then(geoposition=>{
        this.latitudine = geoposition.coords.latitude;
        this.longitudine = geoposition.coords.longitude;

        return String(this.latitudine)+";"+String(this.longitudine);
      })
        .catch(err=>{
          alert("Errore");
          console.log(err);
        });
    }
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
}
