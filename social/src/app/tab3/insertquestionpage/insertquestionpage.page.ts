import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http.service";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-insertquestionpage',
  templateUrl: './insertquestionpage.page.html',
  styleUrls: ['./insertquestionpage.page.scss'],
})
export class InsertquestionpagePage implements OnInit {
  testoDomanda: any="";
  categorie: any=[];
  selectedCategory: any;
  txtError="";
  constructor(private http:HttpService,private modalController:ModalController,private router:Router) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/question/getCategories',{}).subscribe(
      (data)=>{
        console.log(data);
        this.categorie=data.data;
      },
      (err)=>{
        console.log(err);
        if(err.status==603||err.status==604){
          this.router.navigateByUrl('login');
        }
      }
    )
  }

  insertQuestion() {

      this.http.sendPOSTRequest('/question/insertQuestion',{testo:this.testoDomanda,categoria:this.selectedCategory}).subscribe(
        (data)=>{
          console.log(data);
          this.http.sendToast('Domanda pubblicata!');
          this.modalController.dismiss();
        },(err)=>{
          console.log(err);
          if(err.status==603||err.status==604){
            this.router.navigateByUrl('login');
          }
        }
      )


  }

  back() {
    this.modalController.dismiss();
  }
}
