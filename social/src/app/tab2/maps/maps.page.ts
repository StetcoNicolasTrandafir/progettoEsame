import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/http.service'
declare var google:any ;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  map:any;
  coords:any;
  users:any;
  @ViewChild('map',{read:ElementRef,static:false}) mapRef: ElementRef

  constructor(private http: HttpService) { }

  ngOnInit() {

  }

  ionViewDidEnter (){
    this.showMap()
  }

  showMap () {
    this.http.sendPOSTRequest('/user/getPositions',{}).subscribe(
      (data)=>{
        this.users=data.data;
        const location  = new google.maps.LatLng(this.users[0].posizione.split(';')[0],this.users[0].posizione.split(';')[1])
        const options = {
          center:location,
          zoom:15,
          disableDefaultUI:true
    }
    this.map=new google.maps.Map(this.mapRef.nativeElement,options)
    this.addMarkers();
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  addMarkers(){

    for (let i=0; i<this.users.length; i++){
      let position= new google.maps.LatLng(this.users[i].posizione.split(';')[0],this.users[i].posizione.split(';')[1]);
      let marker= new google.maps.Marker({
        position:position,
        title:this.users[i].username,
        latitude:this.users[i].posizione.split(';')[0],
        longitude:this.users[i].posizione.split(';')[1]
      });
      marker.setMap(this.map);
    }
  };

}
