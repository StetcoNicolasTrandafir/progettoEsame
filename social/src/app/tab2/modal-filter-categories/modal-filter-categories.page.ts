import { Component, OnInit,Input } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpService} from "../../service/http.service";



@Component({
  selector: 'app-modal-filter-categories',
  templateUrl: './modal-filter-categories.page.html',
  styleUrls: ['./modal-filter-categories.page.scss'],
})
export class ModalFilterCategoriesPage implements OnInit {

  @Input() selectedCategories;
  categoryArray:any=[];
  categorie:any=[];

  constructor(private modalController: ModalController, private http:HttpService) { }
  dismiss() {

    //this.selectedCategories=this.selectedCategories.split(',');
    //console.log(this.selectedCategories);

    this.modalController.dismiss({
      'categories': this.selectedCategories
    });
  }
  ngOnInit() {
    // console.log("MY CATEGORIES",this.selectedCategories);
    // this.categoryArray=this.selectedCategories.split(",");
    // console.log(this.categoryArray);

    this.http.sendPOSTRequest('/question/getMyCategories',{}).subscribe(
      (data)=>{
        console.log(data);
        this.categorie=data.data;
      },
      (err)=>{
        console.log(err);
      }
    )
  }
}
