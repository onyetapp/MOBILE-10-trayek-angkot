import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DetailtrayekPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detailtrayek',
  templateUrl: 'detailtrayek.html',
})
export class DetailtrayekPage {

  dataangkot: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {

    this.dataangkot = this.navParams.data;

  }

  closeModal() {

    this.viewCtrl.dismiss();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailtrayekPage');
  }

}
