import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import {Storage} from '@ionic/storage';
import {PIPoint} from '../models/pi-point';

@Injectable()
export class UserService {

    constructor(private http: Http, private storage: Storage) { }

    saveUserPointMonitored(pointsMonitored: PIPoint[] ){
        this.storage.ready().then(()=>{     
            // console.log(JSON.stringify(pointsMonitored));   
            this.storage.set('pointsMonitored', pointsMonitored);
        });
    }

    getUserPointMonitored(){
       this.storage.get('pointsMonitored').then((value)=>console.log('get from storage', value));
    }
}