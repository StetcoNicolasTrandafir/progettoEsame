import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-answerarchive',
  templateUrl: './answerarchive.page.html',
  styleUrls: ['./answerarchive.page.scss'],
})
export class AnswerarchivePage implements OnInit {
  risposte: any;
  risposteCaricate: any;
  preferiti:boolean=false;
  constructor(private http:HttpService,private router:Router) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/question/getRecivedAnswer',{}).subscribe(
      (data)=>{
        //console.log(data);
        this.risposte=data.data;
        this.risposteCaricate=this.risposte;
        console.log("risposte==>",this.risposte);
      },(err)=>{
        console.log(err);
      }
    )
  }

  goBack() {
    this.router.navigate(['tabs/tab3']);
  }

  toggleView() {
    console.log(this.preferiti);
    if(!this.preferiti)
      this.risposteCaricate=this.risposte.filter(r=>r.idPreferenza !==null);
    else
      this.risposteCaricate=this.risposte;
  }
}
