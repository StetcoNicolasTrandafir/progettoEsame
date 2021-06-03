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

  constructor(private http:HttpService,private router:Router) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/question/getRecivedAnswer',{}).subscribe(
      (data)=>{
        console.log(data);
        this.risposte=data.data;
      },(err)=>{
        console.log(err);
      }
    )
  }

  goBack() {
    this.router.navigate(['tabs/tab3']);
  }
}
