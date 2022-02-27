import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DistanceProvider } from '../../providers/distance/distance';

/**
 * Generated class for the MapsrutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mapsrute',
  templateUrl: 'mapsrute.html',
})
export class MapsrutePage {

  ruteku: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private dist: DistanceProvider) {

    this.ruteku = this.navParams.data;

    setTimeout(() => {

      this.initHere();

    }, 200);

  }

  showAngkot() {

    let angkotlist = this.alertCtrl.create({
      title: 'Daftar Angkot',
      mode: 'ios',
      buttons: [
        {
          text: 'Tutup',
          role: 'cancel',
        }
      ]
    });

    if (this.ruteku.angkot.length > 0) {

      this.ruteku.angkot.forEach(element => {

        angkotlist.addInput({
          name: 'radio1',
          type: 'radio',
          value: element,
          label: 'Angkot ' + element
        });

      });

    }

    angkotlist.present();

  }

  initHere() {

    const kordinatku = this.ruteku.rute[this.getRandomInt(this.ruteku.rute.length - 1)].split(',')
    let lokasi = {lat: parseFloat(kordinatku[0]), lng: parseFloat(kordinatku[1])};
    // Initialize the platform object:
    let platform = new H.service.Platform({
    'app_id': this.dist.app.id,
    'app_code': this.dist.app.code
    });

    // Obtain the default map types from the platform object
    let maptypes = platform.createDefaultLayers();
    // Define a variable holding SVG mark-up that defines an icon image:
    let svgMarkup = 'assets/icon/path.png';

    // Create an icon, an object holding the latitude and longitude, and a marker:
    let icon = new H.map.Icon(svgMarkup),
    coords = lokasi,
    marker = new H.map.Marker(coords, {icon: icon});

    // Instantiate (and display) a map object:
    let map = new H.Map(
    document.getElementById('mapsrute'),
    maptypes.normal.map,
    {
      zoom: 18,
      center: { lng: lokasi.lng, lat: lokasi.lat }
    });

    // Add the marker to the map and center the map at the location of the marker:
    map.addObject(marker);

  }

  // Initialize and add the map
  initMap() {
    // The location of lokasi
    let kordinatku: any = ['-25.344', '131.036'];
    let namarute: string = 'Nyasar Mas Bro';
    let trayekku: any = [];

    if (this.ruteku.rute.length > 0) {

      namarute = this.ruteku.nama.toUpperCase();
      kordinatku = this.ruteku.rute[this.getRandomInt(this.ruteku.rute.length - 1)].split(',')

    }

    if (this.ruteku.angkot.length > 0) {

      this.ruteku.angkot.forEach(element => {

        trayekku.push('<li><h6>Angkot <strong>'+ element +'</strong><h6></li>')

      });

    }

    let contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h5 id="firstHeading" class="firstHeading">'+
      namarute +
      '</h5><h/>'+
      '<div id="bodyContent">'+
      '<h6>Daftar Trayek</h6>'+
      '<ul style="padding-left: 20px;">'+
      trayekku.join('')+
      '</ul>'+
      '</div>'+
      '</div>';

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    let lokasi = {lat: parseFloat(kordinatku[0]), lng: parseFloat(kordinatku[1])};

    // The map, centered at lokasi
    let map = new google.maps.Map(
      document.getElementById('mapsrute'),
      {zoom: 18, center: lokasi}
    );
    // The marker, positioned at lokasi
    let marker = new mapIcons.Marker({
      position: lokasi,
      map: map,
      icon: {
        path: mapIcons.shapes.MAP_PIN,
        fillColor: '#c44dfc',
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0
      },
      map_icon_label: '<span class="map-icon map-icon-taxi-stand"></span>'
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  }

  getRandomInt(max: number): number {

    return Math.floor(Math.random() * Math.floor(max));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsrutePage');
  }

}
