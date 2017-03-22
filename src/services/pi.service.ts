import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
// import {DataPoint} from '../model/data-point';
// import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import "rxjs/add/observable/interval";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import {SearchFilter} from '../models/search-filter';
// import {PIPoint} from '../models/pi-point';

@Injectable()
export class PIService {
    private baseURL = 'http://localhost:52484/api/PIDataPoints/';

    constructor(private http: Http) {}

     getCurrentPIReadings(afPath: string, refreshRate: number){
         return Observable.interval(refreshRate)
            .startWith(0)
            .switchMap(() => this.http.get(`${this.baseURL}/CurrentValuesByAFPath?AFPath=${afPath}`))
            .map((resp: Response)=>resp.json())
            .catch(error=>{
                console.log('error occurred', error.message); 
                return Observable.throw(`something bad happened.` || error.message);
            });             
     }

     getHistoricalReadings(piTag: string, startTime="*-1h", endTime="*", refreshRate: number){         
         return Observable.interval(refreshRate)
            .startWith(0)
            .switchMap(()=>{
                // const startTime = Date.now()+60*60*1000; // moment().subtract(1, 'h').format();                   
                return this.http.get(`${this.baseURL}/HistoricalReadingsByPITag?PITag=${piTag}&StartTime=${startTime}&EndTime=${endTime}`);
            })
            .map((resp: Response)=>resp.json());            
     }

     searchPIPoints(searchFilter: SearchFilter){         
        return this.http.get(`${this.baseURL}/SearchPIPoints?tag=${searchFilter.tag}
            &descriptor=${searchFilter.descriptor}
            &engUnits=${searchFilter.engUnits}
            &pointSource=${searchFilter.pointSource}`)
            .map((resp: Response)=>resp.json()); 
     }

    //  getRealTimeData(pointList: string[]){
    //     const pointsString = JSON.stringify(pointList);        
    //     return this.http.get(`${this.baseURL}/CurrentValuesByPIPoints?tag={$}`)
    //         .map((resp: Response)=>resp.json()); 
    //  }

     getRealTimeData(pointList: string[], refreshRate = 60000){
        const pointsString = JSON.stringify(pointList);        
        return Observable.interval(refreshRate)
            .startWith(0)
            .switchMap(() => this.http.get(`${this.baseURL}/CurrentValuesByPIPoints?pointsList=${pointsString}`))
            .map((resp: Response)=>resp.json())
            .catch(error=>{
                console.log('error occurred', error.message); 
                return Observable.throw(`something bad happened.` || error.message);
            });        
     }
}

