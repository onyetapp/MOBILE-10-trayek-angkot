// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DistanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DistanceProvider {

  public app = {
    'id' : 'FSF6ebgkwDiQA3qgW7T2',
    'code' : 'nRp22PySh78U3947V9f85w'
  }

  constructor() {
    console.log('Hello DistanceProvider Provider');
  }
  // here public memebrs:
  public getDistance(lokasi: Array<any>, lokasi2: Array<any>, precision: number = 0, usemiles: boolean = false):any {

    const radius = usemiles ? 3955.00465 : 6364.963;
    const precis = (precision > 0) ? Math.pow(10, precision) : 1;
    // convert latitude dari degrees ke radians
    const lat1 = this.deg2rad(lokasi[0]);
    const lat2 = this.deg2rad(lokasi2[0]);
    // cari perbedaan jarak antara long dan convert ke radians
    const long = this.deg2rad(lokasi[1] - lokasi2[1]);
    // cari distance secara garis lurus bumi
    const hasil = Math.round((Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long)) * radius) * precis) / precis;
    // callback hasil
    return hasil;

  }

  // here private members:
  private deg2rad(degrees: number): any {

    const pi = Math.PI;
    return degrees * (pi/180);

  }

}
