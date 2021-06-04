import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //private URL_SERVICE="http://localhost:1337";
  private URL_SERVICE="http://localhost:1337";
  //private URL_SERVICE="http://192.168.219.112:1337";

  constructor(private http: HttpClient,private toastController:ToastController) { }
  public sendPOSTRequest(endPoint: string,datiBody):any{
    //alert(localStorage.getItem('token'));
    //let header=new HttpHeaders().set('token','Bearer '+localStorage.getItem('token'));
    const headers = new HttpHeaders({
  //    'Content-Type': 'application/json; charset=utf-8',
      'token':'Bearer '+localStorage.getItem('token')
    });

    console.log(this.URL_SERVICE+endPoint);
    return this.http.post(this.URL_SERVICE+endPoint,datiBody,{headers:headers});
  }

  public async sendToast(text:string){
    const toast = await this.toastController.create({
      color: 'dark',
      message: text,
      duration: 2000
    });
    toast.present();
  }
}
