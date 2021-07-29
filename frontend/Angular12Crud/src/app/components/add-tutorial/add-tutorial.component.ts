import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';

declare var $: any;


@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  selectedId =-1 ;
  title = '';
  apps: any[] = [];
  consoleErr: any[] = [];

  messageFromServer!: string;
  wsSubscription: Subscription;
  status: string = '';
  constructor(
    private tutorialService: TutorialService,
    private wsService: WebsocketService
  ) {
    this.wsSubscription = this.wsService
      .createObservableSocket('ws://localhost:8080')
      .subscribe(
        (data) => {
          data = JSON.parse(data);

          if (data.type == 'apps') {
            this.apps = data.apps;
          }
          else if (data.type == 'errlog'){
          this.consoleErr.push({ data : data.data , time:new Date(data.at).toString().split(" ").slice(1,5).join(" ") })
          $('.frame').scrollTop($('.frame')[0].scrollHeight);
          }
        },
        (err) => console.log('err'),
        () => {}
      );
  }

  ngOnInit(): void {}

   appErrLogTrue(id: number): void {
     this.selectedId = id
    this.tutorialService.appErrlogTrue({ id }).subscribe((result) => {
     console.log(result);
    });
  }

   appErrLogFalse(id: number): void {
     this.tutorialService.appErrlogFalse({ id }).subscribe((result) => {
      console.log(result);
     });
   }

  sendMessageToServer() {
    this.status = this.wsService.sendMessage('Hello from client');
  }

  closeSocket() {
    this.wsSubscription.unsubscribe();
    this.status = 'The socket is closed';
  }

  ngOnDestroy() {
    this.closeSocket();
  }
}


