import { Component, OnInit } from '@angular/core';
import { HttpService } from "../../service/http.service";
import { Router } from "@angular/router";
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-answerarchive',
  templateUrl: './answerarchive.page.html',
  styleUrls: ['./answerarchive.page.scss'],
})
export class AnswerarchivePage implements OnInit {
  risposte: any;
  risposteCaricate: any;
  preferiti: boolean = false;
  constructor(private http: HttpService, private router: Router, private socketService: SocketService) { }

  ngOnInit() {
    this.caricaRisposte()
    this.socketService.socketListener("answer-accepted").subscribe((dataSocket) => {
      console.log("dataSocket => ", dataSocket)
      this.caricaRisposte();
    })
  }

  caricaRisposte(): void {
    this.http.sendPOSTRequest('/question/getRecivedAnswer', {}).subscribe(
      (data) => {
        //console.log(data);
        this.risposte = data.data;
        this.risposteCaricate = this.risposte;
      }, (err) => {
        console.log(err);
      }
    )
  }


  goBack() {
    this.router.navigate(['tabs/tab3']);
  }

  toggleView() {
    console.log(this.preferiti);
    if (!this.preferiti)
      this.risposteCaricate = this.risposte.filter(r => r.idPreferenza !== null);
    else
      this.risposteCaricate = this.risposte;
  }
}
