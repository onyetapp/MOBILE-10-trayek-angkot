import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DetailrutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detailrute',
  templateUrl: 'detailrute.html',
})
export class DetailrutePage {

  datarute: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {

    this.datarute = this.navParams.data;

  }

  closeModal() {

    this.viewCtrl.dismiss();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailrutePage');
  }

}
