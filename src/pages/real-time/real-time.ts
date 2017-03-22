import {SearchPage} from '../search/search';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DataPoint} from '../../models/data-point';
import {PIPoint} from '../../models/pi-point';
import {PIService} from '../../services/pi.service';
import {PointMonitorService} from '../../services/point-monitor.service';
// import {UserService} from '../../services/user.service';
import {SharedDataService} from '../../services/shared-data.service';
import { Subscription } from 'rxjs/Rx';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-real-time',
  templateUrl: 'real-time.html'
})
export class RealTimePage {
  dataPoints = []; //used for data binding
  private pointsMonitored: PIPoint[]; //used for points being monitored 
  private subscription: Subscription; //used to track subscription of observable

  constructor(private navCtrl: NavController,
    private piService: PIService,
    private pointMonitorService: PointMonitorService,
    private sharedDataService: SharedDataService ,
    private storage: Storage  
   ){}

  ionViewWillEnter(){    
    this.loadDataPoints();
  }
  onLoadSearchPage(){
    this.navCtrl.push(SearchPage);
  }

  onRemovePoint(point){    
    this.pointMonitorService.removePoint(point);   
    if (this.pointMonitorService.getPointList().length === 0){
      this.subscription.unsubscribe();
      this.dataPoints = [];
      return;
    }
       
    this.loadDataPoints();
  }

  private loadDataPoints(){
    this.pointsMonitored = this.pointMonitorService.getPointList();    
    //get from storage. and because storage uses promise, have to get points monitored
    //from here and then feed to the observable that retrieve the data points
    if (this.pointsMonitored.length === 0){
        this.storage.get('pointsMonitored').then(value=>{   
          console.log(value);      
          if (value != null && value.length > 0){            
            this.pointMonitorService.setPointList(value);
            this.pointsMonitored = value;
            this.retrieveDataPoints(); //have to call here in the promise resolve
          }
        });    
    }    
    else
      this.retrieveDataPoints(); //the point list is retrieved from memory after initial load from storage
  }

  private retrieveDataPoints(){        
    if (this.pointsMonitored.length > 0) {
      const points: string[] = this.pointsMonitored.map(item => {return item.tag;});
     
      if (this.subscription)
        this.subscription.unsubscribe(); //unsubscribe the current Subscription

      this.subscription = this.piService.getRealTimeData(points).subscribe(
        resp => {            
          this.dataPoints = resp;
        });
    }    
  }

  showChart(point){      
    this.sharedDataService.sharedData['PIPoint'] = point;
    this.navCtrl.parent.select(1);    
  }
}
