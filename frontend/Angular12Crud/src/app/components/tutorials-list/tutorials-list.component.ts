import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  apps: any[] = [];
  closeModal: string = '';
  consoleLog: any[] = [];
  consoleErr: any[] = [];

  messageFromServer!: string;
  wsSubscription: Subscription;
  status: string = '';
  constructor(
    private tutorialService: TutorialService,
    private modalService: NgbModal,
    private wsService: WebsocketService
  ) {
    let self = this;

    this.wsSubscription = this.wsService
      .createObservableSocket('ws://localhost:8080')
      .subscribe(
        (data) => {
          data = JSON.parse(data);

          if (data.type == 'apps') {
            this.apps = data.apps;
          }
          else if (data.type == 'outlog'){
          this.consoleLog.push({data : data.data, time:new Date(data.at).toString().split(" ").slice(1,5).join(" ") })
          }
          else if (data.type == 'errlog'){
          this.consoleErr.push({data : data.data, time:new Date(data.at).toString().split(" ").slice(1,5).join(" ") })
          }
        },
        (err) => console.log('err'),
        () => {}
      );
  }

  ngOnInit(): void {}

  triggerModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (res) => {
          this.closeModal = `Closed with: ${res}`;
        },
        (res) => {
          this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  list(): void {
    this.tutorialService.getPm2List().subscribe((result) => {
      this.apps = result;
    });
  }

  appRestart(name: string): void {
    this.tutorialService.appRestart({ name: name }).subscribe((result) => {
      console.log(result);
      this.list();
    });
  }

  appStop(name: string): void {
    this.tutorialService.appStop({ name: name }).subscribe((result) => {
      console.log(result);
      this.list();
    });
  }

  appStart(name: string): void{
    this.tutorialService.appStart({name}).subscribe((result) => {
      console.log(result);
    });
  }

  appDelete(id: number): void {
    console.log(id);
    this.tutorialService.appDelete({ id: id }).subscribe((result) => {
      console.log(result);
      this.list();
    });
  }

  appOutlogTrue(id: number): void {
    this.tutorialService.appOutlogTrue({ id }).subscribe((result) => {
      console.log(result);
    });
   }

   appOutlogFalse(id: number): void {
    this.tutorialService.appOutlogFalse({ id }).subscribe((result) => {
      console.log(result);
    });
   }

   appErrLogTrue(id: number): void {
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
