import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { DistanceProvider } from '../../providers/distance/distance';

/**
 * Generated class for the CariangkotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cariangkot',
  templateUrl: 'cariangkot.html',
})
export class CariangkotPage {

  kordinatku: any = { lat: null, long: null };
  kordinattujuan: any = {};
  angkot: any = [];
  shorute: any = "-7.4353068,109.2471289";
  maps: any;
  platform: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public loaderCtrl: LoadingController, public geo: Geolocation, private sql: Storage, private disc: DistanceProvider) {

    setTimeout(() => {

      this.getDataSQL();

    }, 100);

  }

  getDataSQL() {

    let loadku = this.loaderCtrl.create({
      spinner : 'crescent',
      content : 'Load Database ...',
      showBackdrop : true,
      enableBackdropDismiss : true
    });

    loadku.present();

    this.sql.ready().then(() => {

      this.sql.get('tb_realrute').then((data) => {

        if (data) {

          loadku.dismiss();
          this.angkot = JSON.parse(data);
          this.getMyLocation();

        } else {

          loadku.dismiss();
          this.getDataSQL();

        }

      }).catch((err) => {

        loadku.dismiss();
        console.log('Error Load Real Rute!', err);

      });

    }).catch((err) => {

      loadku.dismiss();
      console.log('Error Load Data!', err);

    });

  }

  getMyLocation(): any {

    let loadku = this.loaderCtrl.create({
      spinner : 'crescent',
      content : 'Mencari lokasimu ...',
      showBackdrop : true,
      enableBackdropDismiss : true
    });

    loadku.present();

    this.geo.getCurrentPosition().then((resp: any) => {

      this.kordinatku.lat = resp.coords.latitude;
      this.kordinatku.long = resp.coords.longitude;

      setTimeout(() => {

        this.initHere();
        this.maps.setCenter({lat: resp.coords.latitude, lng: resp.coords.longitude});
        loadku.dismiss();

      }, 200);

    }).catch((error: any) => {

      loadku.dismiss();

      this.alertCtrl.create({

        title : 'Error Get Location',
        message : JSON.stringify(error),
        buttons : [
          {
            text : 'OK',
            role : 'cancel',
          }
        ]

      }).present();

      console.log('Error getting location', String(error));

    });

  }

  initHere() {

    //Initialize the Platform object:
    this.platform = new H.service.Platform({
      'app_id': this.disc.app.id,
      'app_code': this.disc.app.code
    });

    const platform = this.platform;

    let lokasi:any = { lat: this.kordinatku.lat ? this.kordinatku.lat : -7.4353068, lng: this.kordinatku.long ? this.kordinatku.long : 109.2471289 }

    let defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    this.maps = new H.Map(
      document.getElementById('mapstrayek'),
      defaultLayers.normal.map,
      {
        zoom: 15,
        center: lokasi
      });

    // Add map events functionality to the map

    // Create the default UI:
    H.ui.UI.createDefault(this.maps, defaultLayers, 'en-US');
    // Add behavior to the map: panning, zooming, dragging.

    // bikin arker lokasi anda
    if (this.kordinatku.lat && this.kordinatku.long) {

      let svgMarkup = 'assets/icon/path.png';
      // Create an icon, an object holding the latitude and longitude, and a marker:
      let icon = new H.map.Icon(svgMarkup),
      coords = {lat: this.kordinatku.lat, lng: this.kordinatku.long},
      markerku = new H.map.Marker(coords, {icon: icon});

      this.maps.addObject(markerku);
    } // end if

    let mapEvents = new H.mapevents.MapEvents(this.maps);
    new H.mapevents.Behavior(mapEvents);

    this.maps.addEventListener('tap', (evt: any) => {
      let coord = this.maps.screenToGeo(evt.currentPointer.viewportX,
        evt.currentPointer.viewportY);
      this.kordinattujuan = coord;
      this.cekAngkotTersedia();
    });

  }

  cekAngkotTersedia() {

    let listangkot = [];
    let alertku= this.alertCtrl.create({
      title : 'Pilih Angkot',
      subTitle : 'Daftar Angkot Dirute'
    });

    let loadku = this.loaderCtrl.create({
      spinner: 'crescent',
      enableBackdropDismiss: false,
      dismissOnPageChange: true,
      content: 'Mencari Angkot!'
    });

    loadku.present();

    if (this.kordinattujuan) {

      // cari angkot terdekat dari tujuan diambil garis lurus
      this.angkot.forEach((angkot: any) => {

        let kd = '';

        angkot.rute.forEach((rut:any) => {

          let distance = this.disc.getDistance([this.kordinattujuan.lat, this.kordinattujuan.lng], rut, 3) * 1000; // ubah dari KM ke Meter

          // cari rute angkot yang jaraknya palign tidak 50m dari tujuan
          if (distance <= 50 && kd !== angkot.kode) {

            listangkot.push(angkot.kode);
            kd = angkot.kode;

          }

        });

      });

      if (listangkot.length > 0) {

        listangkot.forEach((kode) => {

          alertku.addInput({
            name : 'angkot',
            label : 'Angkot ' + kode.toUpperCase(),
            value : kode,
            type : 'radio'
          });

        });

        alertku.addButton({

          role : 'submit',
          text : 'Buat Rute',
          handler: (data) => {

            this.pilihAngkot(data);

          }

        });

      } else {

        alertku.setMessage('Angkot Tidak Ditemukan!');
        alertku.addButton({
          role : 'cancel',
          text : 'Tutup'
        });

      }

      loadku.dismiss();
      alertku.present();

    } else {

      loadku.dismiss();
      alertku.setMessage('Data tujuan tidak ada!');
      alertku.addButton({
        role : 'cancel',
        text : 'Tutup'
      });
      console.log('Tujuan tidak ditemukan!');

    }

  }

  pilihAngkot(kode: string) {

    let loadku = this.loaderCtrl.create({
      spinner: 'crescent',
      enableBackdropDismiss: false,
      dismissOnPageChange: true,
      content: 'Membuat Rute...'
    });

    loadku.present();
    // cari kangkot dengan kode yang dimaksud
    let angkotku = null, naik = null, turun = null;
    let ruteku = null;
    kode = kode.toUpperCase();

    if (this.kordinatku.lat && this.kordinatku.long && this.kordinattujuan) {

      this.angkot.forEach((angkot: any) => {

        if (angkot.kode = kode) {

          angkotku = angkot;

        }

      });

      // cari rute angkot paling dekat dengan lokasi anda dan lokasi tujuan
      let varbantu1 = Number.MAX_SAFE_INTEGER, varbantu2 = Number.MAX_SAFE_INTEGER;
      let index1 = 0, index2 = 0;

      angkotku.rute.forEach((element: any, i: number) => {

        let distance1 = this.disc.getDistance([this.kordinatku.lat, this.kordinatku.long], element, 3);
        let distance2 = this.disc.getDistance([this.kordinattujuan.lat, this.kordinattujuan.lng], element, 3);

        // cek terdekat dari lokasi anda
        if (distance1 < varbantu1) {

          varbantu1 = distance1;
          index1 = i;
          naik = element;

        }

        // cek terdekat dari lokasi tujuan
        if (distance2 < varbantu2) {

          varbantu2 = distance2;
          index2 = i;
          turun = element;

        }

      });

      if (index1 > index2) {

        ruteku = angkotku.rute.slice(index2, index1);

      } else {

        ruteku = angkotku.rute.slice(index1, index2);

      }

      ruteku.unshift([this.kordinatku.lat, this.kordinatku.long]);
      ruteku.push([this.kordinattujuan.lat, this.kordinattujuan.lng]);

      // buat marker tujuanmu
      let icon1 = new H.map.Icon('assets/icon/path2.png'),
      coords = this.kordinattujuan,
      marker1 = new H.map.Marker(coords, {icon: icon1});

      this.maps.addObject(marker1);

      // buat market angkot naik
      let icon2 = new H.map.Icon('assets/icon/jemput.png'),
      coords2 = { lat: naik[0], lng: naik[1] },
      marker2 = new H.map.Marker(coords2, {icon: icon2});

      this.maps.addObject(marker2);

      // buat market angkot turun
      let icon3 = new H.map.Icon('assets/icon/turun.png'),
      coords3 = { lat: turun[0], lng: turun[1] },
      marker3 = new H.map.Marker(coords3, {icon: icon3});

      this.maps.addObject(marker3);

      // buat ture perjalanan
      let router = this.platform.getRoutingService(),
      routeRequestParams = {
        mode: 'shortest;pedestrian',
        representation: 'display', // Tate Modern
        routeattributes: 'shape',
        maneuverattributes: 'direction,action'
      };

      ruteku.forEach((kordinat, i) => {

        routeRequestParams['waypoint' + i] = String(kordinat[0]) + ',' + String(kordinat[1]);

      });

      router.calculateRoute(
        routeRequestParams,
        (result) => {
          var route = result.response.route[0];
         /*
          * The styling of the route response on the map is entirely under the developer's control.
          * A representitive styling can be found the full JS + HTML code of this example
          * in the functions below:
          */
          this.addRouteShapeToMap(route);
          // ... etc.
        },
        (error) => {
          console.log(error);
        }
      );
      // end

      loadku.dismiss();

    } else {

      loadku.dismiss();
      console.log('Kesalahan tujuan atau lokasi anda!');

    }

  }

  addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;

    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    this.maps.addObject(polyline);
    // And zoom to its bounding rectangle
    this.maps.setViewBounds(polyline.getBounds(), true);
  }

  closeModal() {

    this.viewCtrl.dismiss();

  } //closeModal

  ionViewDidLoad() {
    console.log('ionViewDidLoad CariangkotPage');
  } //ionViewDidLoad

}
