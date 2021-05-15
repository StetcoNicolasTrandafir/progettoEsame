import {Component, Input, OnInit} from '@angular/core';
import {ChatPage} from "../../tab1/chat/chat.page";
import {ModalController} from "@ionic/angular";
import {RequestpagePage} from "../requestpage/requestpage.page";

@Component({
  selector: 'app-myquestion',
  templateUrl: './myquestion.component.html',
  styleUrls: ['./myquestion.component.scss'],
})
export class MyquestionComponent implements OnInit {
  @Input() myQuestion;

  constructor(private modalController:ModalController) { }

  ngOnInit() {
   // alert(this.myQuestion.idDomanda);
  }

  async visualizzaRisposte(idDomanda: number) {
    //alert(idDomanda);
    let oggettoDomanda = {
      myquestion: idDomanda,
      stato: 'S'
    };
    const modal = await this.modalController.create({
      component: RequestpagePage,
      cssClass: '',
      componentProps: {
        domanda:oggettoDomanda
      }
    });
    return await modal.present();
  }
}
