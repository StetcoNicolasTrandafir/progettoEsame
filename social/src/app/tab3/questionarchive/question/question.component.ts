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
  nascondiDomanda: boolean=false;
  constructor(private alertController:AlertController,private http:HttpService) { }

  ngOnInit() {}

  async riprisintaDomanda() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Restore question',
      message: 'Do You really want to public this question?',
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
            this.http.sendPOSTRequest('/question/updateQuestionState',{domanda:this.domanda.idDomanda,stato:'T'}).subscribe(
              (data)=>{
                console.log(data);
                this.nascondiDomanda=true;
                this.http.sendToast('Domanda pubblicata!');
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
