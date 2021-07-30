import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  selectedId = -1;
  title = '';
  app: any = {};
  apps: any[] = [];

  chartValues: any = {};

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
            this.app = this.apps.find(
              (item: any) => item.pm_id == this.selectedId
            );
            console.log(this.app);

            this.chartValues['cpuUsage'] = this.app?.cpu_usage;
            this.chartValues['memoryUsage'] = this.app?.memory_usage;
          }
        },
        (err) => console.log('err'),
        () => {}
      );
  }

  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      marginTop: 0,
      // plotBackgroundColor: "white",
      // plotBorderWidth: 1,
      // plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'Memory Usage',
      y: 200,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.key + ': ' + this.y + '%';
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Composition',
        colorByPoint: true,
        innerSize: '80%',
        data: [
          {
            name: 'Nitrogen',
            color: '#01BAF2',
            y: 78,
          },
          {
            name: 'Oxygen',
            color: '#71BF45',
            y: 20.9,
          },
          {
            name: 'Other gases',
            color: '#FAA74B',
            y: 1.1,
          },
        ],
      },
    ],

  };


  getChart(id: number): void {
    this.selectedId = id;
  }

  // plotChart(): void {
  //   var chart1 = new Highcharts.Chart({
  //     chart: {
  //         renderTo: 'container',
  //     },
  //     xAxis: {
  //         type: 'datetime'
  //     },
  //     series: [{
  //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
  //         pointStart: Date.UTC(2010, 0, 1),
  //         pointInterval: 3600 * 1000 // one hour
  //     }]
  // });
  // }

  list(): void {
    this.tutorialService.getPm2List().subscribe((result) => {
      this.app = result;
    });
  }

  closeSocket() {
    this.wsSubscription.unsubscribe();
    this.status = 'The socket is closed';
  }

  ngOnDestroy() {
    this.closeSocket();
  }
}
