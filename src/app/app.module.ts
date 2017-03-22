import {SearchPage} from '../pages/search/search';
import {TabsPage} from '../pages/tabs/tabs';
import {TestPage} from '../pages/test/test';
import {TrendPage} from '../pages/trend/trend';
import {RealTimePage} from '../pages/real-time/real-time';
import {SeriesPopoverPage} from '../pages/trend/series-popover';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {PIService} from '../services/pi.service';
import {PointMonitorService} from '../services/point-monitor.service';
import {SharedDataService} from '../services/shared-data.service';
import {UserService} from '../services/user.service';
import { Storage } from '@ionic/storage';

// export function provideStorage(){
//   return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' })
// }

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    RealTimePage,
    TrendPage,
    SearchPage,
    TestPage,
    SeriesPopoverPage
  ],
  imports: [  
    IonicModule.forRoot(MyApp)    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    RealTimePage,
    TrendPage,
    SearchPage,
    TestPage,
    SeriesPopoverPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
    PIService,
    PointMonitorService,
    SharedDataService,
    UserService,
    Storage]
    // {provide: Storage, useFactory: provideStorage}]
})
export class AppModule {}
