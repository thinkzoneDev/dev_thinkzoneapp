import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-student-info-chart',
  templateUrl: './student-info-chart.component.html',
  styleUrls: ['./student-info-chart.component.scss']
})
export class StudentInfoChartComponent implements OnInit {
  public options: any ={
    
    chart: {
        type: 'column'
    },
    title: {
        text: 'Student Information chart'
    },
    xAxis: {
        categories: ['BL', 'M1', 'M2', 'M3', 'M4', 'M5'],
        title: {
            text: 'BaseLine and Months'
        },
    },
    yAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5'],
        title: {
            text: 'Skills'
        },
        min: 0,
        max: 4,
        labels: {
            formatter: function (){
                return this.value;
            }
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
        enabled:false
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    credits:{
        enabled:false
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            lineWidth: 1,
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Sanju',
        data: [1,1,1,1,1]
    }, {
        name: 'Shilpa',
        data: [1,1,1,1,1]
    },{
        name: 'Akash',
        data: [1,1,1,1,1]
    }, {
        name: 'Pavana',
        data: [1,1,1,1,1]
    },{
        name: 'Sathya',
        data: [1,1,1,1,1]
    }]
}
  constructor() { }

  ngOnInit() {
    Highcharts.chart('container', this.options);
  }

}
