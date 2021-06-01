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
  interval;

  messages=[];
  testoMessaggio: any;
  constructor(private modalController:ModalController,private Http:HttpService) { }

  ngOnInit() {
    //console.log(this.datoChat);
    this.caricaMessaggi();
    this.interval=setInterval(()=>{
      this.caricaMessaggi();
    },1000);
    //this.caricaMessaggi();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    clearInterval(this.interval);
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  caricaMessaggi():void{
    this.Http.sendPOSTRequest('/chat/getMessagesByReceiver',{destinatario:this.datoChat.idUtente}).subscribe(
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
      this.Http.sendPOSTRequest('/chat/sendMessage',{destinatario:this.datoChat.idUtente,testo:this.testoMessaggio}).subscribe(
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
