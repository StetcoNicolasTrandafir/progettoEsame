import { Component, OnInit } from '@angular/core';
import { ModalFilterCategoriesPage } from './modal-filter-categories/modal-filter-categories.page';
import { ModalController } from "@ionic/angular";
import { HttpService } from "../service/http.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  domande: any = [];
  categorie: any = [];
  selectedCategories: any;
  categoryString: string = "";

  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute, private modalController: ModalController) {
    route.params.subscribe(val => {
      console.log("TOKEN => " + localStorage.getItem('token'));
      this.controlloToken();
    });
  }

  ngOnInit(): void {
    this.selectedCategories = "";
    //this.controlloToken();
    this.http.sendPOSTRequest('/question/getMyCategories', {}).subscribe(
      (data) => {
        //console.log(data);
        this.categorie = data.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }


  async openFilter() {

    // this.selectedCategories.forEach(category => {
    //   this.categoryString+=","+category;
    // });
    const modal = await this.modalController.create({
      component: ModalFilterCategoriesPage,
      cssClass: '',
      componentProps: {
        myCategories: this.categoryString,
        categorie: this.categorie
      }
    });

    modal.onDidDismiss().then(({ data }: any) => {
      if (data?.categorie?.length) {
        this.selectedCategories = data?.categorie?.filter(({ isSelected }) => isSelected).map(({ idCategoria }) => idCategoria)
        this.caricaDomandePerCategorie()
      } else {
        this.caricaHome()
      }

    })
    return await modal.present();
  }

  private controlloToken() {
    this.http.sendPOSTRequest("/user/controlloToken", {}).subscribe(
      (data) => {
        //console.log(data);
        localStorage.setItem('token', data.token);
        this.caricaHome();
      },
      (error) => {
        console.log(error);
        //alert(error.status);
        if (error.status == 604 || error.status == 603) {
          this.router.navigateByUrl('intro');
        }
      }
    )
  }

  private caricaHome() {
    this.http.sendPOSTRequest("/question/getQuestions", {}).subscribe(
      (data) => {
        //console.log(data.data);
        this.domande = data.data;
      }, (error) => {
        console.log(error);
        if (error.status == 603 || error.status == 604) {
          this.router.navigateByUrl('login');
        }
      }
    );
  }

  caricaDomandePerCategorie() {
    if (this.selectedCategories.length > 0) {
      //console.log(this.selectedCategories);

      this.http.sendPOSTRequest("/question/getQuestionsByCategories", { categorie: this.selectedCategories }).subscribe(
        (data) => {
          //console.log(data.data);
          this.domande = data.data;
        }, (error) => {
          console.log(error);
          if (error.status == 603 || error.status == 604) {
            this.router.navigateByUrl('login');
          }
        }
      );
    } else {
      this.http.sendPOSTRequest("/question/getQuestions", {}).subscribe(
        (data) => {
          console.log(data.data);
          this.domande = data.data;
        }, (error) => {
          console.log(error);
          if (error.status == 603 || error.status == 604) {
            this.router.navigateByUrl('login');
          }
        }
      );
    }

  }
}
