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
      myquestion: this.myQuestion.idDomanda,
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
      header: 'Archive question',
      message: 'Are you sure you want to archive this question?',
      buttons: [
        {
          text: 'Undo',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            //console.log('Confirm Okay');
            this.http.sendPOSTRequest('/question/updateQuestionState',{domanda:this.myQuestion.idDomanda,stato:'F'}).subscribe(
              (data)=>{
                console.log(data);
                this.nascondiDomanda=true;
                this.http.sendToast('Question archived!');
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
