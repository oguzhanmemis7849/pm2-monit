import { Component } from '@angular/core';
// import { Subscription } from 'rxjs';
import { WebsocketService } from './services/websocket.service';



@Component({
  selector: 'app-root',
  providers: [WebsocketService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular12Crud';

}


// messageFromServer!: string;
  // wsSubscription: Subscription;
  // status: string = '';

  // constructor(private wsService: WebsocketService) {
  //   let self = this;

  //   this.wsSubscription = this.wsService
  //     .createObservableSocket('ws://localhost:8080')
  //     .subscribe(
  //       (data) => console.log(self.wsService.sendMessage('Hello from client')),

  //       (err) => console.log('err'),
  //       () => {}
  //     );
  // }

  // sendMessageToServer() {
  //   this.status = this.wsService.sendMessage('Hello from client');
  // }

  // closeSocket() {
  //   this.wsSubscription.unsubscribe();
  //   this.status = 'The socket is closed';
  // }

  // ngOnDestroy() {
  //   this.closeSocket();
  // }
