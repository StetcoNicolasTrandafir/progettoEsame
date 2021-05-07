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

  ngOnInit() {

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
    return await modal.present();
  }
}
