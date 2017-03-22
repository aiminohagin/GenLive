import { Injectable } from '@angular/core';
import {PIPoint} from '../models/pi-point';
import {Storage} from '@ionic/storage';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PointMonitorService {
    pointsMonitored = [];
    constructor(private storage: Storage) { }

    addPoint(point: PIPoint){
        if (this.pointsMonitored.findIndex(pt => pt.tag === point.tag) > -1)
            return; // do not add if exists
        this.pointsMonitored.push(point);    
        this.savePoints();  
    }

    removePoint(point: PIPoint) {
        const index = this.pointsMonitored.findIndex(pt => pt.tag === point.tag);
        this.pointsMonitored.splice(index, 1);
        this.savePoints();
    }

    getPointList() : PIPoint[]{ 
        return this.pointsMonitored;
    }

    setPointList(points : PIPoint[]) { 
        this.pointsMonitored = points;
    }

    private savePoints(){
        this.storage.ready().then(()=>{                
            this.storage.set('pointsMonitored', this.pointsMonitored);
        });
    }

    isAdded(point: PIPoint){
       return (this.pointsMonitored.findIndex(pt => pt.tag === point.tag) > -1);
    }
}