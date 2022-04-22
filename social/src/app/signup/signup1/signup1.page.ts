import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.page.html',
  styleUrls: ['./signup1.page.scss'],
})
export class Signup1Page implements OnInit {
  nome: any="Andrea";
  cognome: any="Tomatis";
  dataNascita: Date;
  sesso:any="M"
  constructor(private router:Router,private http:HttpService, private pipe:DatePipe) { }

  ngOnInit() {
  }

  nextPage (){
    this.router.navigate(["/signup/signup2",{
      nome:this.nome,
      cognome:this.cognome,
      dataNascita:this.pipe.transform(this.dataNascita, 'dd-MM-yyyy'),
      sesso:this.sesso
    }])
  }

}
