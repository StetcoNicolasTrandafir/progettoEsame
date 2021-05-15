import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-insertquestionpage',
  templateUrl: './insertquestionpage.page.html',
  styleUrls: ['./insertquestionpage.page.scss'],
})
export class InsertquestionpagePage implements OnInit {
  testoDomanda: any;
  categorie: any=[];
  selectedCategory: any;

  constructor(private http:HttpService,private modalController:ModalController) { }

  ngOnInit() {
    this.http.sendPOSTRequest('/api/getCategories',{}).subscribe(
      (data)=>{
        console.log(data);
        this.categorie=data.data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  insertQuestion() {
    //alert(this.selectedCategory);
    this.http.sendPOSTRequest('/api/insertQuestion',{testo:this.testoDomanda,categoria:this.selectedCategory}).subscribe(
      (data)=>{
        console.log(data);
        this.modalController.dismiss();
      },(err)=>{
        console.log(err);
      }
    )
  }
}
