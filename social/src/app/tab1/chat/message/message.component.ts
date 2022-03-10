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
  ora:String;
  constructor() { }

  ngOnInit() {
    //console.log(this.messaggio);
    //alert(this.idChat);
    // console.log((this.messaggio.data.split('T'))[1].substr(0,5));
    this.ora=(this.messaggio.data.split('T'))[1].substr(0,5)
    if(this.idChat==this.messaggio.destinatario){//HO INVIATO IO IL MESSAGGIO
      this.sonoIo=true;
    }else{
      this.sonoIo=false;
    }
  }

}
