import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../service/http.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-requestpage',
  templateUrl: './requestpage.page.html',
  styleUrls: ['./requestpage.page.scss'],
})
export class RequestpagePage implements OnInit {
  @Input() domanda;
  richieste=[];
  nessunaRisposta: boolean=false;

  constructor(private router:Router,private http:HttpService,private modalController:ModalController) {
  }

  ngOnInit() {
    console.log(this.domanda);
    this.http.sendPOSTRequest('/question/getAnswersByQuestion',{stato:'S',domanda:this.domanda.myquestion}).subscribe(
      (data)=>{
        console.log(data);
        this.richieste=data.data;
        if(this.richieste.length==0){
          //this.label="Non hai nessuna risposta per questa domanda!";
          this.nessunaRisposta=true;
        }else{
          this.nessunaRisposta=false;
        }
      },
      (err)=>{
        console.log(err);
        if(err.status==603||err.status==604){
          this.router.navigateByUrl('login');
        }
      }
    )
  }

  back() {
    this.modalController.dismiss();
  }
}
