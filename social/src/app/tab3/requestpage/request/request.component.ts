import {Component, Input, OnInit} from '@angular/core';
import {HttpService} from "../../../service/http.service";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() richiesta;


  constructor(private http:HttpService) { }

  ngOnInit() {

  }

  nega($event: MouseEvent) {
    this.http.sendPOSTRequest('/question/handleRequest',{risposta:this.richiesta.idRisposta,stato:'R'}).subscribe(
      (data)=>{
        console.log(data);
        //TODO CANCELLARE RICHIESTA
      },(err)=>{
        console.log(err);
      }
    )
  }

  accetta($event: MouseEvent) {
    this.http.sendPOSTRequest('/question/handleRequest',{risposta:this.richiesta.idRisposta,stato:'A'}).subscribe(
      (data)=>{
        console.log(data);
        this.inserisciMatch();
        this.inviaMessaggi();

      },(err)=>{
        console.log(err);
      }
    )
  }

  inviaMessaggi(){
    this.http.sendPOSTRequest('/chat/startChat',{utenteRisposta:this.richiesta.utente,risposta:this.richiesta.testoRisposta,domanda:this.richiesta.testoDomanda}).subscribe(
      (data)=>{
        console.log(data);
      },(err)=>{
        console.log(err);
      }
    )
  }

  inserisciMatch(){
    this.http.sendPOSTRequest('/chat/makeMatch',{utenteRisposta:this.richiesta.utente}).subscribe(
      (data)=>{
        console.log(data);
      },(err)=>{
        console.log(err);
      }
    )
  }
}
