import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-answerpage',
  templateUrl: './answerpage.page.html',
  styleUrls: ['./answerpage.page.scss'],
})
export class AnswerpagePage implements OnInit {
  risposte: any=[];

  constructor(private router:Router,private http:HttpService) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/api/getAnswersByUser',{}).subscribe(
      (data)=>{
        console.log(data);
        this.risposte=data.data;
      },(err)=>{
        console.log(err);
      }
    )
  }

  back() {
    this.router.navigateByUrl('tabs/tab3');
  }
}
