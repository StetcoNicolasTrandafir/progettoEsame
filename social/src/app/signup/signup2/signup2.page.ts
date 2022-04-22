import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page implements OnInit {

  data;
  mail="prova@gmail.com";
  username="provaprova";
  password="password";
  confermaPassword="password";

  constructor(private route:ActivatedRoute,private http:HttpService, private router:Router) {
    
    route.params.subscribe(
      (data)=>{
        console.log(data)
        this.data={...data}
      }
    )
  }


  ngOnInit() {
  }

  nextPage () {
    
    if(this.password!=this.confermaPassword){
      alert("le due password non coincidono")
      return null
    }
     this.http.sendPOSTRequest("/user/signUp/checkCredentials", {
      mail:this.mail,
      user:this.username
    }).subscribe(
      ({data})=>{
        console.log(data)
        if(data=="OK"){
        this.router.navigate(["signup/signup3",{
          ...this.data,
           mail:this.mail,
           username:this.username,
           password:this.password
         }])
        }
      },
      (error)=>{
        console.log(error)
      }
    ) 

    

  }

}
