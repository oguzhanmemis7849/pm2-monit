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
  updateFlag = false;
  show = false;
  chartValuesCpu: any = {};
  chartValuesMemory: any = [];

  messageFromServer!: string;
  wsSubscription: Subscription;
  status: string = '';

  highcharts = Highcharts;

  chartCPU: Highcharts.Options = {
    chart: {
      marginTop: 0,
      // plotBackgroundColor: "white",
      // plotBorderWidth: 1,
      // plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'CPU Usage',
      y: 140,
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
        data: [],
      },
    ],
  };

  chartMemory: Highcharts.Options = {
    title: {
      text: 'Memory Usage (mb/sec)',
    },
    xAxis: {
      title: {
        text: 'seconds',
      },
    },
    yAxis: {
      title: {
        text: 'Usage(mb)',
      },
    },
    series: [
      {
        data: [],
        type: 'line',
      },
    ],
  };

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

            this.chartValuesCpu['cpuUsage'] = this.app?.cpu_usage;
            if (this.app?.memory_usage)
              this.chartValuesMemory.push(this.app?.memory_usage);

            this.updateChartCpu();
            this.updateChartMemory();
          }
        },
        (err) => console.log('err'),
        () => {}
      );
  }

  getChart(id: number): void {
    this.show = true;

    this.selectedId = id;
    this.chartValuesMemory = [];
    this.chartMemory.series = [
      {
        data: this.chartValuesMemory,
        type: 'line',
      },
    ];
  }

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

  updateChartCpu() {
    const self = this;

    setTimeout(() => {
      this.chartValuesCpu['cpuUsage'] = parseInt(
        this.app?.cpu_usage.toString().split('%').join('')
      );
      if (!isNaN(this.chartValuesCpu['cpuUsage'])) {
        this.chartCPU.series = [
          {
            type: 'pie',
            name: 'Composition',
            colorByPoint: true,
            innerSize: '80%',
            data: [
              {
                name: 'CPU',
                color: '#009900',
                y: this.chartValuesCpu['cpuUsage'],
              },
              {
                name: 'Free',
                color: '#d9d9d9',
                y: 100 - this.chartValuesCpu['cpuUsage'],
              },
            ],
          },
        ];

        self.updateFlag = true;
      }
    }, 1000);
  }

  updateChartMemory() {
    const self = this;
    setTimeout(() => {
      console.log(this.chartValuesMemory);
      if (this.chartValuesMemory) {
        this.chartMemory.series = [
          {
            data: this.chartValuesMemory,
            type: 'line',
          },
        ];

        self.updateFlag = true;
      }
    }, 1000);
  }
}
