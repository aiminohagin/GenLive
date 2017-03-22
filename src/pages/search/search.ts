import {FormGroup} from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SearchFilter} from '../../models/search-filter'
import {PIPoint} from '../../models/pi-point'
import {PIService} from '../../services/pi.service'
import {PointMonitorService} from '../../services/point-monitor.service'

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  searchDefaultFilter = new SearchFilter('PG.WISE.*', '*', 'mw', '*'); //set default values for input
  searchAction = 'Search';
  foundPIPoints: PIPoint[];
  private addedPoints: PIPoint[];

  constructor(private piService: PIService,
    private pointMonitorService: PointMonitorService){}
    

  onSearch(f: FormGroup){
    this.searchAction = 'Searching ...';
    const searchFilter = new SearchFilter(f.value.tag, f.value.description, f.value.UOM, f.value.pointSource);
   
    this.piService.searchPIPoints(searchFilter).subscribe(
      resp => {        
        this.foundPIPoints = resp;   
        this.searchAction = 'Search';       
      });
  }

  onAddRemovePoint(point: PIPoint){
    if (this.pointMonitorService.isAdded(point))
      this.pointMonitorService.removePoint(point);
    else
      this.pointMonitorService.addPoint(point);
    // this.addedPoints = this.pointMonitorService.getPointList();
  }

  isAdded(point: PIPoint){
    return this.pointMonitorService.isAdded(point);
  }

  // onToggle(point,event){
  //   console.log ('toggle ', point, event);
  // }
}
