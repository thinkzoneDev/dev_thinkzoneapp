import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController  } from '@ionic/angular';
import { ExpensemodalPage } from './../modal/expensemodal/expensemodal.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})
export class ExpensePage implements OnInit {
  expense_list: any= [];
  total_amount: number= 0;
  total_amount_2decimal: any;
  final_data: any= [];
  _operationdate: string='';

  constructor(
    private navController: NavController, 
    private alertController: AlertController, 
    private modalController: ModalController, 
    private loadingController: LoadingController, 
    private api: RestApiService ) {
      let dt = new Date;
      let dt_str = (dt.getFullYear())+'-'+(1+dt.getMonth())+'-'+(dt.getDate());
      this._operationdate = dt_str;
    }
  ngOnInit() {}

  async add_expense(){
    const modal = await this.modalController.create({
      component: ExpensemodalPage,
      cssClass: 'expense-modal-css'
    });
    modal.onDidDismiss().then((detail: any) => {
      if (detail !== null) {
        if(detail.role == 'backdrop'){}
        else{
          let expense_obj = detail.data;
          if(Object.keys(expense_obj).length > 0)
            this.expense_list.push(expense_obj);
          this.getTotalAmount();
        }
      }
   });
    return await modal.present();
  }

  async edit_expense(i: number, expense: any){
    
    // check for 'Other' type expense
    let name = expense['name'];
    let name2: string = "";
    let amount = expense['amount'];
    let arr = name.split(':');
    if(arr[0] == 'Other') {
      name = arr[0];
      name2 = arr[1];
      this.editexpense_other(i, name,name2,amount);
    }else{
      name = arr[0];
      name2 = "";
      this.editexpense(i, name,name2,amount);
    }
  }

  delete_expense(i: number){
    this.expense_list.pop(i);
    this.getTotalAmount();
  }

  getTotalAmount(){
    this.total_amount = 0;
    this.expense_list.forEach(element => {
      let amt = parseFloat(element['amount'] || 0);
      this.total_amount += amt;
    });
    this.total_amount_2decimal= this.total_amount.toFixed(2);
  }

  async save_expense(){
    let userid = localStorage.getItem("_userid");
    let username = localStorage.getItem("_username");
    this.expense_list.forEach(element => {
      let typ = element['name'] || '';
      let amt = parseFloat(element['amount'] || 0);
      let obj = {
        userid: userid,
        username: username,
        expense_type: typ,
        expense_amount: amt
      }
      this.final_data.push(obj);
    });

    let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savedailyexpense({data:this.final_data})
        .subscribe(res => {
          loading.dismiss();
          this.showAlert('Daily expenses', '', 'Daily expenses saved '+res['status']+' !!!');
        }, err => {
          loading.dismiss();
        });
        this.navController.navigateRoot('/home-results');
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

  async editexpense(i: number, name: string, name2: string, amount: string) {
    const alert = await this.alertController.create({
          header: name,
          inputs: [
                    {
                      name: 'amount',
                      placeholder: 'Amount',
                      value: amount,
                      type: 'number'
                    }
                  ],
          buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: data => {
                      }
                    },
                    {
                      text: 'OK',
                      handler: data => {
                        let obj = {
                          name: name,
                          amount: data.amount
                        };
                        this.expense_list.splice(i,1,obj);
                        this.getTotalAmount();
                      }
                    }
                  ]
    });
    await alert.present();
  }

  async editexpense_other(i: number, name: string, name2: string, amount: string) {
    const alert = await this.alertController.create({
          header: name,
          inputs: [
                    {
                      name: 'name2',
                      placeholder: 'Other type',
                      value: name2
                    },
                    {
                      name: 'amount',
                      placeholder: 'Amount',
                      value: amount,
                      type: 'number'
                    }
                  ],
          buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: data => {
                      }
                    },
                    {
                      text: 'OK',
                      handler: data => {
                        let obj = {
                          name: name+':'+data.name2,
                          amount: data.amount
                        };
                        this.expense_list.splice(i,1,obj);
                        this.getTotalAmount();
                      }
                    }
                  ]
    });
    await alert.present();
  }

  // confirm box
  async showConfirm() {
    const header='Confirmation !!!'; 
    const subheader= '';
    const message= 'Are you sure, you want to save the changes?';
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
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
            this.save_expense();
          }
        }
      ]
    });
    await alert.present();
  }
}
