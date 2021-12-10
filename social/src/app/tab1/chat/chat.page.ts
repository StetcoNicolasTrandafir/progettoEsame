import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IonContent, ModalController} from "@ionic/angular";
import {HttpService} from "../../service/http.service";
import {Router} from "@angular/router";
import { Socket } from 'ngx-socket-io';
//import {setInterval} from "timers";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @Input() datoChat;
  interval;
  scroll=true;
  @ViewChild(IonContent) content: IonContent;

  messages=[];
  testoMessaggio: any;
  constructor(private modalController:ModalController,private Http:HttpService,private router:Router,private socket: Socket) { }

  ngOnInit() {
    //console.log(this.datoChat);
    this.caricaMessaggi();
    this.interval=setInterval(()=>{

      this.caricaMessaggi();
    },1000);
    this.socket.ioSocket.io.opts.query = { token: "CIAO" }
    this.socket.connect();
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
        if(this.scroll){
          this.content.scrollToBottom(600);
          this.scroll=false;
        }
      },(err)=>{
        console.log(err);
        if(err.status==603||err.status==604){
          this.router.navigateByUrl('login');
        }
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
          if(err.status==603||err.status==604){
            this.router.navigateByUrl('login');
          }
        }
      );
      this.socket.emit('message-sent', { to:this.datoChat.idUtente, text: this.testoMessaggio, from:localStorage.getItem("token")});
    }

  }
}
