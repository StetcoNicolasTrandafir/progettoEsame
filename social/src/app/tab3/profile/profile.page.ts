import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../service/http.service";
import {Geolocation} from "@capacitor/geolocation";
import {AlertController} from "@ionic/angular";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";

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
  infoUtente:any={};
  errorePassword: any;
  confirmPwd: any;
  newPwd: any;
  oldPwd: any;
  selectedFile;
  erroreFoto: any;
  id: any;
  selectedCategories: any;
  categorie: any;


  constructor(private router:Router,private http:HttpService,private activeroute:ActivatedRoute, private alertController:AlertController) {
    activeroute.params.subscribe(
      (data)=>{
        //alert(data.id);
        this.id=data.id
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
    this.http.sendPOSTRequest('/question/getCategories',{}).subscribe(
      (data)=>{
        console.log(data);
        this.categorie=data.data;
        this.http.sendPOSTRequest('/question/getBlackList',{}).subscribe(
          (blackList)=>{
            console.log(blackList)
            this.selectedCategories=blackList.data;
            for(let i=0; i< blackList.data.length; i++)
              this.selectedCategories[i]=(blackList.data[i].idCategoria).toString();

            //console.log("BLACKLISTT==>", this.selectedCategories);
          },
          (errBlackList)=>{
            console.log(errBlackList);
          }
        );
      },(err)=>{
        console.log(err);
      }
    )
  }

  goBack() {
    this.router.navigate(['tabs/tab3']);

  }

  saveInfo() {
    console.log(this.selectedCategories);
    this.http.sendPOSTRequest('/question/updateBlacklist',{categorie:this.selectedCategories}).subscribe(
      (data)=>{
        console.log(data);

      },(err)=>{
        console.log(err);
      }
    )
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
          this.http.sendToast('Dati modificati!');
        },(err)=>{
          console.log(err);
          if(err.status==603||err.status==604){
            this.router.navigateByUrl('login');
          }
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
          this.http.sendToast('Password modificata!');
        },err=>{
          console.log(err);
          if(err.status==603||err.status==604){
            this.router.navigateByUrl('login');
          }
        }
      )
    }
  }

  async updatePosition() {
    //alert(position);

    //alert(position);
    const alertPos = await this.alertController.create({
      cssClass: '',
      header: 'Aggiorna Posizione',
      message: 'Sei sicuro di voler aggiornare la tua posizione?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'Conferma',
          handler: async () => {
            //console.log('Confirm Okay');
            let position = await this.getPosition();
            console.log(position);
            //alert(position);
            this.http.sendPOSTRequest('/user/updatePosition',{posizione:position}).subscribe(
              data=>{
                console.log(data);
                this.http.sendToast('Posizione salvata!');
              },err=>{
                console.log(err);
              }
            )
          }
        }
      ]
    });

    await alertPos.present();


  }

  async getPosition(){
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    return coordinates.coords.latitude+";"+coordinates.coords.longitude;
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  changeFoto() {
    if(this.selectedFile){
      this.erroreFoto="";
      const uploadData = new FormData();
      uploadData.append('myFile', this.selectedFile, this.id+"."+this.selectedFile.name.split('.')[this.selectedFile.name.split('.').length-1]);
      this.http.sendPOSTRequest("/user/updatePicture", uploadData).subscribe(
        (result) => {
          console.log(result);
          this.http.sendToast('Foto modificata!');
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
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.erroreFoto="Foto non caricata";
    }
  }

}
