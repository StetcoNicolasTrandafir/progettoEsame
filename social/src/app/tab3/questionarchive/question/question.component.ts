import {Component, Input, OnInit} from '@angular/core';
import {AlertController} from "@ionic/angular";
import {HttpService} from "../../../service/http.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() domanda;
  constructor(private alertController:AlertController,private http:HttpService) { }

  ngOnInit() {}

  async arhiviaDomanda() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Pubblica Domanda',
      message: 'Sei sicuro di voler pubblicare questa domanda?',
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
            this.http.sendPOSTRequest('/question/updateQuestionState',{domanda:this.domanda.idDomanda,stato:'T'}).subscribe(
              (data)=>{
                console.log(data);
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
