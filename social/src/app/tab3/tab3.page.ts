import {Component, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  constructor(private menu:MenuController,private router:Router) {}

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


  }
}
