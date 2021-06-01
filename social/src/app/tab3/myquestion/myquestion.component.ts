import {Component, Input, OnInit} from '@angular/core';
import {ChatPage} from "../../tab1/chat/chat.page";
import {AlertController, ModalController} from "@ionic/angular";
import {RequestpagePage} from "../requestpage/requestpage.page";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-myquestion',
  templateUrl: './myquestion.component.html',
  styleUrls: ['./myquestion.component.scss'],
})
export class MyquestionComponent implements OnInit {
  @Input() myQuestion;
  nascondiDomanda: boolean=false;

  constructor(private modalController:ModalController,private alertController:AlertController,private http:HttpService) { }

  ngOnInit() {

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

  async arhiviaDomanda() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Archivia Domanda',
      message: 'Sei sicuro di voler archiviare questa domanda?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Conferma',
          handler: () => {
            //console.log('Confirm Okay');
            this.http.sendPOSTRequest('/question/updateQuestionState',{domanda:this.myQuestion.idDomanda,stato:'F'}).subscribe(
              (data)=>{
                console.log(data);
                this.nascondiDomanda=true;
              },(err)=>{
                console.log(err);

              }
            )
          }
        }
      ]
    });

    await alert.present();
  }
}
