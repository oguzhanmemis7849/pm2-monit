import { Component } from '@angular/core';
import * as Highcharts from "highcharts"
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent {

  constructor() { }
  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      plotBackgroundColor: "white",
      plotBorderWidth: 1,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Air Composition',
      y:225
    },
  legend:{
    enabled:false
  },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter:function(){
            return this.key+ ': ' + this.y + '%';
          }
        },
        showInLegend: true
      }
    },
    series: [{
      type: "pie",
      name: 'Composition',
      colorByPoint: true,
        innerSize: '70%',
      data: [{
        name: 'Nitrogen',
       // color: '#01BAF2',
        y: 78,
      }, {
        name: 'Oxygen',
       // color: '#71BF45',
        y: 20.9
      }, {
        name: 'Other gases',
        //color: '#FAA74B',
        y: 1.1
      }]
    }]
  }
}
