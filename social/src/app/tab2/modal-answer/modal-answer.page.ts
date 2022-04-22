import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpService} from "../../service/http.service";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-answer',
  templateUrl: './modal-answer.page.html',
  styleUrls: ['./modal-answer.page.scss'],
})
export class ModalAnswerPage implements OnInit {
  @Input() testo;
  @Input() username;
  @Input() categoria;
  @Input() idDomanda;
  @Input() colore;
  testoRisposta: any;

  d=false;

  constructor(private modalController:ModalController,private http:HttpService,private toastController:ToastController,private router:Router) { }

  ngOnInit() {
    //alert(this.colore);
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'd':this.d
    });
  }

  invia() {
    //alert(this.idDomanda);
    this.http.sendPOSTRequest('/question/insertAnswer',{testo:this.testoRisposta,domanda:this.idDomanda}).subscribe(
      (data)=>{
        console.log(data);
        this.presentToast();
        this.d=true;
        this.dismiss();

      },(error)=>{
        console.log(error);
        if(error.status==603||error.status==604){
          this.router.navigateByUrl('login');
        }
      }
    )
  }
  async presentToast() {
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'answer sent!',
      duration: 3000
    });
    toast.present();
  }
}
