import {TestPage} from '../test/test';
import {TrendPage} from '../trend/trend';
import {RealTimePage} from '../real-time/real-time';
import { Component } from '@angular/core';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  realTimePage = RealTimePage;
  trendPage = TrendPage;
  testPage = TestPage;
}
