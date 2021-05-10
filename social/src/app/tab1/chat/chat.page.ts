import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpService} from "../../service/http.service";
//import {setInterval} from "timers";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @Input() datoChat;

  messages=[];
  testoMessaggio: any;
  constructor(private modalController:ModalController,private Http:HttpService) { }

  ngOnInit() {
    //console.log(this.datoChat);
    this.caricaMessaggi();
    setInterval(()=>{
      this.caricaMessaggi();
    },5000);
    //this.caricaMessaggi();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  caricaMessaggi():void{
    this.Http.sendPOSTRequest('/api/getMessagesByReceiver',{destinatario:this.datoChat.idUtente}).subscribe(
      (data)=>{
        console.log(data);
        this.messages=data.data;
      },(err)=>{
        console.log(err);
      }
    );
  }

  invia() {
    if(this.testoMessaggio!=""&&this.testoMessaggio!="\n"){
      this.Http.sendPOSTRequest('/api/sendMessage',{destinatario:this.datoChat.idUtente,testo:this.testoMessaggio}).subscribe(
        (data)=>{
          console.log(data);
          this.caricaMessaggi();
          this.testoMessaggio="";
        },(err)=>{
          console.log(err);
        }
      );
    }

  }
}
