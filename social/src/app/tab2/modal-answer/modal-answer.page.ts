import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpService} from "../../service/http.service";

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

  constructor(private modalController:ModalController,private http:HttpService) { }

  ngOnInit() {
    //alert(this.colore);
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  invia() {
    //alert(this.idDomanda);
    this.http.sendPOSTRequest('/api/insertAnswer',{testo:this.testoRisposta,domanda:this.idDomanda}).subscribe(
      (data)=>{
        console.log(data);
      },(error)=>{
        console.log(error);
      }
    )
  }
}
