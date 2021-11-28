import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  constructor(private http: HttpService) { }
  @Input() idUtente;
  @Input() user;

  domande:any;


  ngOnInit() {
    //console.log(this.idUtente);
    this.http.sendPOSTRequest('/question/getQuestionsByUser',{utente:this.idUtente}).subscribe(
      (data)=>{
        console.log(data.data);
        this.domande=data.data;
      },(error)=>{
        console.log(error);
        }
    );

  }

}
