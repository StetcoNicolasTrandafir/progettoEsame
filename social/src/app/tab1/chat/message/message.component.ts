import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() messaggio;
  @Input() idChat;
  sonoIo:boolean;
  constructor() { }

  ngOnInit() {
    //console.log(this.messaggio);
    //alert(this.idChat);
    if(this.idChat==this.messaggio.destinatario){//HO INVIATO IO IL MESSAGGIO
      this.sonoIo=true;
    }else{
      this.sonoIo=false;
    }
  }

}
