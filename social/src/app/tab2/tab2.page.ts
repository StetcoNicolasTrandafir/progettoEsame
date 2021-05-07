import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  domande: any=[];

  constructor(private http:HttpService) {}

  ngOnInit(): void {
    this.http.sendPOSTRequest("/api/getQuestions",{}).subscribe(
      (data)=>{
        console.log(data.data);
        this.domande=data.data;
      },(error)=>{
        console.log(error);
      }
    );
  }

}
