import { Component, OnInit } from '@angular/core';
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
      plotBackgroundColor: "#fff",
      plotBorderWidth: 1,
      plotShadow: false,
    },
    title: {
      text: "Test",
      y:225
    },
  legend:{
    enabled:false
  },
    tooltip: {
      pointFormat: '{series.name}: <b>{{ item.cpu_usage }}</b>'
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
      type:"pie",
      name: 'Composition',
      colorByPoint: true,
        innerSize: '70%',
      data: [{
        name: 'Usage',
       // color: '#01BAF2',
        y: 78,
      }, {
        name: 'Free',
       // color: '#71BF45',
        y: 20.9
      }]
    }]
  }
}
