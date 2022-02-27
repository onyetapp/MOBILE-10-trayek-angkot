import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DetailtrayekPage } from '../detailtrayek/detailtrayek';
import { DetailrutePage } from '../detailrute/detailrute';
import { CarirutePage } from '../carirute/carirute';
import { CariangkotPage } from '../cariangkot/cariangkot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  listangkot: any = [];
  listrute: any   = [];
  segment: string = 'angkot';

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    private sql: Storage
  ) {

    setTimeout(() => {

      this.getDataAngkot();
      this.getDataRute();

      // setTimeout(() => {
      //   this.bautMatrixFULL();
      // }, 5000);

    }, 100);

  }

  bautMatrixFULL() {

    let loadku = this.loadCtrl.create({
      spinner : 'crescent',
      content : 'Proses Mencari Angkot...',
      showBackdrop : true,
      enableBackdropDismiss : true
    });

    loadku.present();

    let allrute: any = [];
    this.listrute.forEach((a, i) => {

      console.log(i);

      a.rute.forEach((x) => {

        allrute.push(x);

      });

    });

    if (allrute.length >= 2115) {

      this.sql.set('ruteAll', JSON.stringify(allrute)).then(() => {

        loadku.dismiss();

      });

    }
  }

  showCariRute() {

    let modal = this.modalCtrl.create(CarirutePage);

    modal.present();

  }

  showCariAngkot() {

    let modal = this.modalCtrl.create(CariangkotPage);

    modal.present();

  }

  showDetailTrayek(angkot: any = {}) {

    let jenis: any = typeof angkot;
    let rutenya: any = [];

    if (jenis == 'object') {

      angkot.rute.forEach((element) => {

        rutenya.push(this.getNameRuteFromID(element));

      });

      this.modalCtrl.create(DetailtrayekPage, {'kode' : angkot.kode, 'rute' : rutenya}).present();

    } else {

      console.log('Tipe data tidak sesuai !', angkot);

    }

  }

  showDetailRute(rute: any = {}) {

    let jenis: any = typeof rute;
    let angkotnya: any = [];

    if (jenis == 'object') {

      this.listangkot.forEach(angkot => {

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

      this.modalCtrl.create(DetailrutePage, { 'id' : rute.id, 'nama' : rute.nama, 'angkot' : angkotnya }).present();

    } else {

      console.log('Tipe data tidak sesuai !', rute);

    }

  }

  getDataAngkot() {

    this.sql.get('tb_angkot').then((val) => {

      if (val) {

        this.listangkot = JSON.parse(val);

      } else {

        setTimeout(() => {

          this.getDataAngkot();

        }, 100);
        console.log('Data angkot tidak ditemukan!');

      }

    }).catch((err) => {

      console.log('Error Get Angkot', JSON.stringify(err));

    });

  }

  getDataRute() {

    this.sql.get('tb_rute').then((val) => {

      if (val) {

        this.listrute = JSON.parse(val);

      } else {

        setTimeout(() => {

          this.getDataRute();

        }, 100);
        console.log('Data rute tidak ditemukan!');

      }

    }).catch((err) => {

      console.log('Error Get rute', JSON.stringify(err));

    });

  }

  getNameRuteFromID(id: any): any {

    if (this.listrute.length > 0) {

      let nama: any;

      this.listrute.forEach(rute => {

        if (rute.id == id) {

          nama = rute.nama;

        }

      });

      return nama;

    }

  }

}
