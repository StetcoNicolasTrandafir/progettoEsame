import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-questionarchive',
  templateUrl: './questionarchive.page.html',
  styleUrls: ['./questionarchive.page.scss'],
})
export class QuestionarchivePage implements OnInit {
  domande: any=[];

  constructor(private router:Router,private http:HttpService) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/api/getQuestionByUser',{disponibile:'F'}).subscribe(
      (data)=>{
        console.log(data);
        this.domande=data.data;
      },(err)=>{
        console.log(err);
      }
    )
  }

  back() {
    this.router.navigateByUrl('tabs/tab3');
  }
}
