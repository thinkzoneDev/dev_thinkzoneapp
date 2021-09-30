import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';

// Modals
import { RestApiService } from './../../../rest-api.service';


@Component({
  selector: 'app-makepayment',
  templateUrl: './makepayment.page.html',
  styleUrls: ['./makepayment.page.scss']
})
export class MakepaymentPage {
  // fee structure
  fee_ece_annually = '600';
  fee_ece_semiannually = '350';
  fee_ece_monthly = '100';
  fee_pge_annually = '800';
  fee_pge_semiannually = '450';
  fee_pge_monthly = '120';
  modes = [{value: 'annually', text: 'Annually'}, {value: 'semi-annually', text: 'Semi Annually'}, {value: 'monthly', text: 'Monthly'}];

  total_payable_amount = 0;
  total_paid_amount = 0;
  total_pending_amount = 0;
  toolbarshadow = false;
  public makepaymentFormGroup: FormGroup;
  amount = '';
  remark = '';

  res: any;
  userid: string;
  username: string;
  centerid: string;
  centername: string;
  studentid: string;
  studentname: string;
  program = '';
  class = '';

  payment_type = '';
  month_diff: number;
  registration_date = '';
  running_month = 0;
  regdt = '';

  is_first_transaction = true;
  pay_amount = '0';
  pay_status: string = 'incomplete';

  constructor(
    private formBuilder: FormBuilder,
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams
  ) {
    this.makepaymentFormGroup = this.formBuilder.group({
      amount: ['', [Validators.required]],
      remark: ['', [Validators.required]]
    });
    
    this.res = this.navParams.data.res;

    this.userid = this.res.userid;
    this.username = this.res.username;
    this.centerid = '';
    this.centername = '';
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.class = this.res.class;
    this.registration_date = this.res.registration_date;

    //this.calculatemonth(new Date(this.registration_date));
    this.regdt = (this.res.registration_date == undefined || this.res.registration_date == null || this.res.registration_date == '') ? 'NA' : new Date(this.registration_date).toDateString();

    this.getalltchpaymentdetailsbystudentid(this.studentid);
  }

  // get all transactions
  async getalltchpaymentdetailsbystudentid(sid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltchpaymentdetailsbystudentid(sid).subscribe(res => {
        if (res.length > 0) {
          res.forEach(element => {
            this.total_paid_amount += parseInt(element.amount);
          });
          this.total_payable_amount = (res[0]['total_amount'] == undefined || res[0]['total_amount'] == null || res[0]['total_amount'] == '') ? '0' : res[0]['total_amount'];

          this.is_first_transaction = false;
          const ptype = res[0]['payment_type'];
          this.amount_type_onchange(ptype);
          this.payment_type = ptype;
          this.total_pending_amount = this.total_payable_amount - this.total_paid_amount;
          
        } else {
          this.is_first_transaction = true;
          this.payment_type = '';
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
  }

  // month difference
  calculatemonth(d1) {     // old date
    const d2 = new Date();  // new date
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    months = (d2.getDate() >= d1.getDate()) ? months += 1 : months;
    months = months <= 0 ? 0 : months;
    this.month_diff = months;
    this.running_month = this.month_diff + 1;
  }

  // amount type on change
  amount_type_onchange(amount_type) {
    this.payment_type = amount_type;
    if (this.program === 'ece') {
      if (amount_type === 'annually') { this.pay_amount = this.fee_ece_annually; } else if (amount_type === 'semi-annually') { this.pay_amount = this.fee_ece_semiannually; } else if (amount_type === 'monthly') { this.pay_amount = this.fee_ece_monthly; } else { this.pay_amount = '0'; }
    } else if (this.program === 'pge') {
      if (amount_type === 'annually') { this.pay_amount = this.fee_pge_annually; } else if (amount_type === 'semi-annually') { this.pay_amount = this.fee_pge_semiannually; } else if (amount_type === 'monthly') { this.pay_amount = this.fee_pge_monthly; } else { this.pay_amount = '0'; }
    } else {
      this.pay_amount = '0';
    }
  }

  // save attendance
  async makepayment(trantype) {
    this.total_pending_amount = (trantype == '1st') ? this.total_payable_amount : this.total_pending_amount;
    if (this.total_payable_amount > 0 && this.total_paid_amount > 0 && (this.total_payable_amount - this.total_paid_amount) <= 0) {
      alert('All dues are cleared !!!');
    }else if (this.total_payable_amount === undefined || this.total_payable_amount == null || this.total_payable_amount <= 0) {
      alert('Please enter total amount !!!');
    }else if (this.pay_amount === undefined || this.pay_amount == null )  {
      alert('Please enter valid amount !!!');
    }else if(parseInt(this.pay_amount) == 0 && this.total_payable_amount>0 && trantype != '1st'){
      alert('Please enter valid amount !!!');
    }else if (parseInt(this.pay_amount) > this.total_pending_amount) {
      alert('Please enter valid amount !!!');
    }else{
      this.pay_status = (this.total_payable_amount <= (this.total_paid_amount+parseInt(this.pay_amount))) ? 'complete' : 'incomplete';
      let data = {};
      data = {
        userid : this.userid,
        username : this.username,
        studentid : this.studentid,
        studentname : this.studentname,
        program : this.program,
        class : this.class,
        registration_date : this.registration_date,
        //payment_type : this.payment_type,
        total_amount : this.total_payable_amount,
        amount : this.pay_amount,
        status: this.pay_status
      };
      this.showConfirm('Confirmation', '', 'Do you want to proceed?', data);
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savetchpaymentdetails(data)
      .subscribe(res => {
        this.showAlert('Info', '', 'Payment ' + res['status'] + ' !!!');
        loading.dismiss();
        this.modalController.dismiss({data: 'Ok'});
      }, err => {
        loading.dismiss();
      });
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, data: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.save(data);
          }
        }
      ]
    });
    await alert.present();
  }

  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
}
