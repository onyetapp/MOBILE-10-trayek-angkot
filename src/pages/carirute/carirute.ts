import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MapsrutePage } from '../mapsrute/mapsrute';

/**
 * Generated class for the CarirutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-carirute',
  templateUrl: 'carirute.html',
})
export class CarirutePage {

  searchQuery: string = '';
  items: any = [];
  showitems: any = [];
  angkot: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadCtrl: LoadingController, private sql: Storage) {

    this.loadDataFromSQL();

  }

  autoComplete() {
    let input = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    let defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631)
    );
    let options = {
      bounds: defaultBounds,
      types: ['establishment']
    };

    let autocomplete = new google.maps.places.Autocomplete(input, options);

    console.log(autocomplete);

  }

  loadDataFromSQL() {

    let loader = this.loadCtrl.create({

      spinner: 'crescent',
      content: 'loading data...',
      enableBackdropDismiss: true,
      showBackdrop: true

    });

    loader.present();

    this.sql.ready().then(() => {

      this.sql.get('tb_rute').then((data) => {

        if (data) {

          this.items = JSON.parse(data);

        } else {

          console.log('No data found !');

        }

        this.sql.get('tb_angkot').then((data) => {

          if (data) {

            this.angkot = JSON.parse(data);

          } else {

            console.log('No data found !');

          }

          loader.dismiss();

        }).catch((err) => {

          loader.dismiss();
          console.log('Error Load Table Rute!', JSON.stringify(err));

        });

      }).catch((err) => {

        loader.dismiss();
        console.log('Error Load Table Rute!', JSON.stringify(err));

      });

    }).catch((err) => {

      loader.dismiss();
      console.log('Error Prepare SQLite!', JSON.stringify(err));

    });

  }

  initializeItems() {

    this.showitems = this.items;

  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      this.showitems = this.showitems.filter((item) => {

        return (item.nama.toLowerCase().indexOf(val.toLowerCase()) > -1);

      });

    } else {

      this.showitems = [];

    }

  }

  showMapsRute(rute: any) {

    let jenis: any = typeof rute;
    let angkotnya: any = [];

    if (jenis == 'object') {

      this.angkot.forEach(angkot => {

        let cekangkot: boolean = false;

        angkot.rute.forEach(cekrute => {

          if (cekrute == rute.id) {

            cekangkot = true;

          }

        });

        if (cekangkot) {

          angkotnya.push(angkot.kode);

        }

      });

      this.navCtrl.push(MapsrutePage, { 'id' : rute.id, 'nama' : rute.nama, 'angkot' : angkotnya, 'rute' : rute.rute });

    } else {

      console.log('Tipe data tidak sesuai !', rute);

    }

  }

  closeModal() {

    this.viewCtrl.dismiss();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarirutePage');
    // this.autoComplete();
  }

}
