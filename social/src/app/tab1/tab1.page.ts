import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "../service/http.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor(private router: Router,private Http:HttpService) {}

  ngOnInit(){
    //alert();
    this.Http.sendPOSTRequest("/api/controlloToken",{}).subscribe(
      (data)=>{
        console.log(data);
        localStorage.setItem('token',data.token);
      },
      (error)=>{
        console.log(error);
        //alert(error.status);
        if(error.status==604||error.status==603){
          this.router.navigateByUrl('login');
        }
      }
    )
    //this.router.navigateByUrl('login');
    /*this.Http.sendPOSTRequest("/api/prova",{}).subscribe(
      (data)=>{
        console.log(data);
      },
      (error)=>{
        console.log(error);
      }
    )*/
  }
}
