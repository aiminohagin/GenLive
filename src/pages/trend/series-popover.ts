import {ViewController} from 'ionic-angular';
import { Component, OnInit } from '@angular/core';

@Component({    
    selector: 'page-seriesPopover',
    templateUrl: 'series-popover.html'
})
export class SeriesPopoverPage implements OnInit {
    constructor(private viewCtrl: ViewController) { }

    ngOnInit() { 
        console.log('popover init');
    }

  close() {
    this.viewCtrl.dismiss();
  }
}