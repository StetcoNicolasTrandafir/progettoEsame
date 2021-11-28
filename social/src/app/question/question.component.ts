import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ModalAnswerPage} from "../tab2/modal-answer/modal-answer.page";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  constructor(private modalController:ModalController) { }
  @Input() domanda;
  domandaNascosta: boolean=false;

  ngOnInit() {
    console.log(this.domanda);

  }

  async rispondi($event) {
    const modal = await this.modalController.create({
      component: ModalAnswerPage,
      cssClass: '',
      componentProps: {
        'testo': this.domanda.testoDomanda,
        'username': this.domanda.username,
        'categoria': this.domanda.nomeCategoria,
        'idDomanda':this.domanda.idDomanda,
        'colore':this.domanda.colore
      }
    });
    modal.onDidDismiss().then((data:any)=>{
      //alert(data.data.d);
      this.domandaNascosta=data.data.d;
    })
    return await modal.present();
  }
}
