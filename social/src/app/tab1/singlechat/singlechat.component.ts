import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {ChatPage} from "../chat/chat.page";

@Component({
  selector: 'app-singlechat',
  templateUrl: './singlechat.component.html',
  styleUrls: ['./singlechat.component.scss'],
})
export class SinglechatComponent implements OnInit {
  @Input() singleChat;
  mostraAvatar: boolean=false;
  constructor(private router:Router,private modalController:ModalController) { }

  ngOnInit() {
  }

  async openChat() {

      const modal = await this.modalController.create({
        component: ChatPage,
        cssClass: '',
        componentProps: {
          'datoChat': this.singleChat
        }
      });
      return await modal.present();

  }

  alert() {
    alert();
  }
}
