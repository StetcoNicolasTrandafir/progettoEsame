import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var google:any ;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  map:any;

  @ViewChild('map',{read:ElementRef,static:false}) mapRef: ElementRef

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter (){
    this.showMap()
  }

  showMap () {
    const location  = new google.maps.LatLng(-17,82, 31)
    const options = {
      center:location,
      zoom:15,
      disableDefaultUI:true
    }
    this.map=new google.maps.Map(this.mapRef.nativeElement,options)
  }

}
