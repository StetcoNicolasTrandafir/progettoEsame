import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

  @Input() category;
  constructor() { }
  bubble: string = "BALOON_VUOTO";
  visible: boolean = false;

  toggleSelection() {
    this.category.isSelected = !this.category.isSelected
    if (this.category.isSelected)
      this.bubble = "BALOON_PIENO";
    else
      this.bubble = "BALOON_VUOTO";
  }

  toggleCollapse() {
    console.log(this.visible)
    this.visible = !this.visible;
  }
  ngOnInit() {
    if (this.category.isSelected)
      this.bubble = "BALOON_PIENO";
    else
      this.bubble = "BALOON_VUOTO";
  }

}
