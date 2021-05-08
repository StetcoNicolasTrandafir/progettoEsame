import {Component, OnInit} from '@angular/core';
import {HttpService} from "../service/http.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  domande: any=[];

  constructor(private http:HttpService,private router:Router,private route:ActivatedRoute) {
    route.params.subscribe(val => {
      this.controlloToken();
    });
  }

  ngOnInit(): void {
    //this.controlloToken();
  }

  private controlloToken(){
    this.http.sendPOSTRequest("/api/controlloToken",{}).subscribe(
      (data)=>{
        console.log(data);
        localStorage.setItem('token',data.token);
        this.caricaHome();
      },
      (error)=>{
        console.log(error);
        //alert(error.status);
        if(error.status==604||error.status==603){
          this.router.navigateByUrl('login');
        }
      }
    )
  }

  private caricaHome(){
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
