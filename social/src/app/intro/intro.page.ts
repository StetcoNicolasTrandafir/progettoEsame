import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(private router: Router) { }

  signup() {
    this.router.navigateByUrl('signup');
  }
  login() {
    this.router.navigateByUrl('login');
  }

  ngOnInit() {
  }

}
