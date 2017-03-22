import { Component, ViewChild, OnInit} from '@angular/core';
import {PopoverController, NavController,  NavParams,  Content,  App} from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { PIService } from '../../services/pi.service';
import {SharedDataService} from '../../services/shared-data.service';
import { PIPoint } from '../../models/pi-point';
import {SeriesPopoverPage} from './series-popover';
import { Observable} from 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'page-trend',
  templateUrl: 'trend.html'
})
export class TrendPage implements OnInit{
  @ViewChild('listContent') content: Content; //get hold of the ion-content for scroll
  chart;
  selectedSeries; //for data detail binding
  selectedPoint: any;
  showData = false;
  private subscriptions=[];// {tag: string, subscription: Subscription}[];
 
   tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  startDT = (new Date(Date.now() - this.tzoffset - 60000*60)).toISOString();
  endDT = (new Date(Date.now() - this.tzoffset)).toISOString();
  
  constructor(private navCtrl: NavController, private navParams: NavParams, 
    private piService: PIService,  private sharedDataService: SharedDataService, 
    private popoverCtrl: PopoverController,
    private app: App) {}  

  ngOnInit(){
    this.initChart();  
    
  }

  goBackHour(){
    console.log('go back an hour');
  }

  goForwardHour(){
    console.log('go forward an hour');
  }
  initChart() {
    //global option
    Highcharts.setOptions({
        global: {
          useUTC: false
        },
         colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
    });
    
    this.chart = Highcharts.chart('container', {
      chart: {
            type: 'spline',
            animation: true,
            spacingRight: 1,
            spacingLeft: 1,
             backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(200, 200, 255)']
                ]
            }                
        },
      title: {
          text: 'Real-time Trend'
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 60
      },
      yAxis: {            
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                  Highcharts.numberFormat(this.y, 2);
          }
      },
      legend: {
          enabled: true
      },
      exporting: {
          enabled: false
      },
      credits: {
        enabled: false
      } ,
      plotOPtions: {
        series: {
          point: {
            events: {
              click: function() {
                console.log('point clicked', this);
              }
            }
          }
        }
      }     
    });
  }

  
  ionViewWillEnter() {   
    this.addSeriesToChart(); //need to wait for chart element to be created first.        
  }

  private addSeriesToChart(){
    const point = <PIPoint>this.sharedDataService.sharedData['PIPoint'];
   
    if (typeof point === 'undefined')    
      return; //no need to get data
    
    if (typeof (this.chart.series.find(item=>item.options.id === point.tag)) !== 'undefined')      
      return; // return if the PI tag has the series shown already
    
    const self = this; // self = this, the TrendPage

    const series = this.chart.addSeries({
      allowPointSelect: true,
      animationLimit: Infinity,
      id: point.tag,
      name: point.descriptor, //set the legend  
      events: { 
        //series click event
        click: function(event) {                  
          self.selectedSeries = this; //this = added series, not trendPage
          if (event.point)
          {
            self.selectedPoint = event.point;
            self.scrollTo(event.point.x);
          }  
        }  
      }
    });       
    
    this.selectedSeries = series; //for detail data binding
  //  console.log(this.selectedSeries.options.id);
    const subscription = this.piService.getHistoricalReadings(point.tag, '*-1h', '*', 60000).subscribe(
      (resp) => {        
        const data = this.convertResponse(resp.Values);
        series.setData(data);    
        this.selectedSeries = series; //for detail data binding
        this.showData = true;       
      },
      (error) => {
        console.log(error);
      }
    );

    this.subscriptions.push({tag: point.tag, subscription: subscription});
    console.log(this.subscriptions);

  }

  private convertResponse(data:any[]){
    return data.map(value => [Date.parse(value.ValueDT), parseFloat(value.Value)]);
  }
 
  private scrollTo(elementID: string) { 
    const elem = document.getElementById(elementID); 
    if (elem)
      this.content.scrollTo(0, elem.offsetTop - elem.offsetHeight, 500);   
  }

  onRemoveSeries(){
    const index = this.chart.series.findIndex(item => item.options.id === this.selectedSeries.options.id);
    this.removeSubscription(this.selectedSeries.options.id); //id = tag
    this.chart.series[index].remove();    
    this.selectedSeries = this.chart.series[0]; 
    if (!(typeof this.chart.series[0] === 'undefined')) 
      this.chart.series[0].select(true);    

  }

  private removeSubscription(tag: string){    
    const index = this.subscriptions.findIndex(item => item.tag === tag);
    this.subscriptions[index].subscription.unsubscribe();
    this.subscriptions.splice(index, 1);    
  }

  presentPopover(event){
    let popover = this.popoverCtrl.create(SeriesPopoverPage);
    popover.present({
      ev: event
    });
  }
}
