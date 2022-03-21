import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

  @Input() category;
  constructor() { }
  selected:boolean;
  bubble:string="BALOON_VUOTO";
  visible:boolean=false;

  toggleSelection(){
    this.selected=!this.selected
    if(this.selected)
      this.bubble="BALOON_PIENO";
      else
        this.bubble="BALOON_VUOTO";
  }

  toggleCollapse(){
    console.log(this.visible)
    this.visible=!this.visible;
  }
  ngOnInit() {
    console.log("CATEGORIA====>",this.category);
  }

}
