import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { HttpService } from "../../service/http.service";



@Component({
  selector: 'app-modal-filter-categories',
  templateUrl: './modal-filter-categories.page.html',
  styleUrls: ['./modal-filter-categories.page.scss'],
})
export class ModalFilterCategoriesPage implements OnInit {

  @Input() categorie;


  constructor(private modalController: ModalController, private http: HttpService) { }

  dismiss() {

    //this.selectedCategories=this.selectedCategories.split(',');
    //console.log(this.selectedCategories);

    this.modalController.dismiss({ categorie: this.categorie });
  }

  ngOnInit() {

  }
}
