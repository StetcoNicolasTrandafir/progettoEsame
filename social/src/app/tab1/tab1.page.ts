import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../service/http.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  chats: any=[];

  constructor(private router: Router,private Http:HttpService,private activatedRoute:ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      //Controllo CHAT
      this.Http.sendPOSTRequest('/api/getChats',{}).subscribe(
        (data)=>{
          console.log(data);
          this.chats=data.data;
        },(err)=>{
          console.log(err);
        }
      );
    }
    )
  }

  ngOnInit(){

  }

}
