import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-signup3',
  templateUrl: './signup3.page.html',
  styleUrls: ['./signup3.page.scss'],
})
export class Signup3Page implements OnInit {

  selectedFile;
  descrizione;
  data;

  constructor(private route: ActivatedRoute, private router:Router, private http:HttpService, private pipe:DatePipe ) {
    route.params.subscribe(
      (data)=>{
        console.log(data)
        this.data={...data}
      }
    )
   }

  ngOnInit() {
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  async signUp () {
    let position= await this.getPosition();
    const uploadData = new FormData();

    let param={
      ...this.data,
      foto:this.selectedFile.name,
      descrizione:this.descrizione,
      posizione: position,
      user:this.data.username
    }
    console.log("paras =>", param)
    this.http.sendPOSTRequest("/user/signUp/insertUser", param).subscribe(
      (data) => {
        if (data.code == 50) {
          alert(data.data)
        } else {
          console.log(data);
          localStorage.setItem('token', data.token);
          uploadData.append('myFile', this.selectedFile, data.data+"."+this.selectedFile.name.split('.')[this.selectedFile.name.split('.').length-1]);
          this.http.sendPOSTRequest("/user/processUpFile", uploadData).subscribe(
            (result) => {
              console.log(result);
              this.router.navigateByUrl('');
              this.http.sendToast('Registrazione effettuata!');
            },
            (error) => {
              console.log(error);
            }
          );

        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  async getPosition(){
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    return coordinates.coords.latitude+";"+coordinates.coords.longitude;
  }

}
