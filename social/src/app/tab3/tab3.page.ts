import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";
import {Router} from "@angular/router";
import {HttpService} from "../service/http.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  user;
  constructor(private menu:MenuController,private router:Router,private Http:HttpService) {}

  openMenu() {
    //alert();
    //this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  ngOnInit(): void {
    this.Http.sendPOSTRequest('/api/getUser',{}).subscribe(
      (data)=>{
        //console.log(data);
        this.user=data.data[0];
        console.log(this.user);
      },(err)=>{
        console.log(err);
      }
    )

  }
}
