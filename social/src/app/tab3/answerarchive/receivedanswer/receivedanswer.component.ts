import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from "../../../service/http.service";

@Component({
  selector: 'app-receivedanswer',
  templateUrl: './receivedanswer.component.html',
  styleUrls: ['./receivedanswer.component.scss'],
})
export class ReceivedanswerComponent implements OnInit {
  @Input() risposta;
  constructor(private http:HttpService) { }

  ngOnInit() {}

  nega($event: MouseEvent) {
    this.http.sendPOSTRequest('/question/handleRequest',{risposta:this.risposta.idRisposta,stato:'R'}).subscribe(
      (data)=>{
        console.log(data);
        //TODO CANCELLARE RICHIESTA
        this.risposta.stato='R';
      },(err)=>{
        console.log(err);
      }
    )
  }

  accetta($event: MouseEvent) {
    this.http.sendPOSTRequest('/question/handleRequest',{risposta:this.risposta.idRisposta,stato:'A'}).subscribe(
      (data)=>{
        console.log(data);
        this.inserisciMatch();
        this.inviaMessaggi();
        this.risposta.stato='A';
      },(err)=>{
        console.log(err);
      }
    )
  }
  inviaMessaggi(){
    this.http.sendPOSTRequest('/chat/startChat',{utenteRisposta:this.risposta.utente,risposta:this.risposta.testoRisposta,domanda:this.risposta.testoDomanda}).subscribe(
      (data)=>{
        console.log(data);
      },(err)=>{
        console.log(err);
      }
    )
  }

  inserisciMatch(){
    this.http.sendPOSTRequest('/chat/makeMatch',{utenteRisposta:this.risposta.utente}).subscribe(
      (data)=>{
        console.log(data);
      },(err)=>{
        console.log(err);
      }
    )
  }

}
