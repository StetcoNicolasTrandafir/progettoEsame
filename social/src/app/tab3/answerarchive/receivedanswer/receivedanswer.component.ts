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

  icona:string="star-outline";
  ngOnInit() {
    //console.log("RISPOSTA==>",this.risposta)
    if(this.risposta.idPreferenza)
      this.icona="star-sharp";
  }

  nega($event: MouseEvent) {
    this.http.sendPOSTRequest('/question/handleRequest',{risposta:this.risposta.idRisposta,stato:'R'}).subscribe(
      (data)=>{
        console.log(data);
        //TODO CANCELLARE RICHIESTA
        this.risposta.stato='R';
        this.http.sendToast('Richiesta rifiutata!');
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
        this.http.sendToast('Richiesta accettata!');
      },(err)=>{
        console.log(err);
      }
    )
  }
  inviaMessaggi(){
    this.http.sendPOSTRequest('/chat/startChat',{utenteRisposta:this.risposta.utente,risposta:this.risposta.testoRisposta,domanda:this.risposta.testoDomanda}).subscribe(
      (data)=>{
        console.log("CHIAMATAAAAAAAAAAAAAAAAA",data);
      },(err)=>{
        console.log("ERROREEEEE",err);
      }
    )
  }

  inserisciMatch(){
    console.log("UTENTE RISPOSTA======>",this.risposta);

    this.http.sendPOSTRequest('/chat/makeMatch',{utenteRisposta:this.risposta.autoreRisposta}).subscribe(
      (data)=>{
        console.log(data);
      },(err)=>{
        console.log(err);
      }
    )
  }

  togglePreferiti(sender) {

    console.log(sender.risposta)
    //alert(sender.risposta.idRisposta)
    if(this.icona=="star-outline"){
      //inserisci nei preferiti

      this.http.sendPOSTRequest('/question/addFavouriteAnswer',{risposta:sender.risposta.idRisposta}).subscribe(
        (data)=>{
          console.log(data);
          this.icona="star-sharp";
          this.risposta.idPreferenza=7;
        },
        (err)=>{
          console.log(err);
        }
      );
    }
    else{
      //rimuovi dai preferiti
      this.http.sendPOSTRequest('/question/removeFavouriteAnswer',{risposta:sender.risposta.idRisposta}).subscribe(
        (data)=>{
          console.log(data);
          this.icona="star-outline";
          this.risposta.idPreferenza=null;
        },
        (err)=>{
          console.log(err);
        }
      );

    }


  }
}
