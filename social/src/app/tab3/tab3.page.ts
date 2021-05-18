import {Component, OnInit} from '@angular/core';
import {MenuController, ModalController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../service/http.service";
import {RequestpagePage} from "./requestpage/requestpage.page";
import {InsertquestionpagePage} from "./insertquestionpage/insertquestionpage.page";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  user:any="";
  id:number;
  myQuestions=[];
  constructor(private menu:MenuController,private router:Router,private Http:HttpService,private activatedroute:ActivatedRoute,private modalController:ModalController){
    this.activatedroute.params.subscribe(params => {
      this.Http.sendPOSTRequest('/user/getUser',{}).subscribe(
        (data)=>{
          //console.log(data);
          this.user=data.data[0];
          console.log(this.user);
          this.id=this.user.idUtente;
          //alert(this.user);
        },(err)=>{
          console.log(err);
        }
      )

      this.Http.sendPOSTRequest('/question/getQuestionsByUser',{disponibile:'T'}).subscribe(
        (data)=>{
          console.log(data);
          this.myQuestions=data.data;
        },
        (err)=>{
          console.log(err);
        }
      )
      }
    )
  }

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

  apriRichieste() {
    this.menu.close('first');
    this.router.navigate(['tabs/tab3/requestpage',this.id]);
  }

  async inserisciDomanda() {
    //alert(idDomanda);
    const modal = await this.modalController.create({
      component: InsertquestionpagePage,
      cssClass: '',
      componentProps: {}
    });
    return await modal.present();
  }

  apriRisposte() {
    this.menu.close('first');
    this.router.navigate(['tabs/tab3/answerpage',this.id]);
  }

  apriArchivioDomande() {
    this.menu.close('first');
    this.router.navigate(['tabs/tab3/questionarchive']);
  }
}
