import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailtrayekPage } from '../pages/detailtrayek/detailtrayek';
import { DetailrutePage } from '../pages/detailrute/detailrute';
import { CariangkotPage } from '../pages/cariangkot/cariangkot';
import { CarirutePage } from '../pages/carirute/carirute';
import { MapsrutePage } from '../pages/mapsrute/mapsrute';
import { DistanceProvider } from '../providers/distance/distance';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailtrayekPage,
    DetailrutePage,
    CariangkotPage,
    CarirutePage,
    MapsrutePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__angkotdb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailtrayekPage,
    DetailrutePage,
    CariangkotPage,
    CarirutePage,
    MapsrutePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DistanceProvider,
    Geolocation,
  ]
})
export class AppModule {}
