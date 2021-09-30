import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { EditprofilemodalPage } from "../modal/editprofilemodal/editprofilemodal.page";
import { CameraOptions, Camera } from "@ionic-native/camera/ngx";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { ImageuploadService } from "./imageupload.service";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage {
  [x: string]: any;
  buttonclass = "hidden";
  _userid: string;
  _username: string;
  _id = "";
  _studentid = "";
  _phone: number;
  _dob = "";
  _address = "";
  _locality = "";

  selected_qualification = "";
  address = "";
  locality = "";
  selected_class_text = "";
  selected_class_txt_translate = "";
  phone: number;
  gender = "";
  dob = "";
  res: any;
  flag = "";
  msg_heading: string;
  msg_success: string;
  msg_fail: string;
  is_selected: boolean;

  hide_class_field = false;
  all_images_arr: any = "";
  image_preview: any = null;
  imagebase64: any;
  croppedImagepath = "";
  s3name: any;
  img: any;
  var_picture: any;
  safeImg: any;
  state: any;

  odisha_id = 20;
  all_districts: [];
  all_blocks: [];
  block_value: any = [];

  selected_stateid: any;
  selected_statename: any;
  selected_districtid: any;
  selected_districtname: any;
  selected_district_obj: any;
  selected_blockid: any;
  selected_blockname: any;

  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private navParams: NavParams,
    public api: RestApiService,
    private translateService: TranslateService,
    private imageuploadService: ImageuploadService,
    private serverDownMsg: ServerDownService
  ) {
    this.s3name = new Date().getTime();
    this.msg_heading = this.translateService.get("PROFILE.msg_heading")[
      "value"
    ];
    this.msg_success = this.translateService.get("PROFILE.msg_success")[
      "value"
    ];
    this.msg_fail = this.translateService.get("PROFILE.msg_fail")["value"];
    this.confirmBox_header = this.translateService.get("PPT.confirmBox_header")[
      "value"
    ];
    this.confirmBox_msg =
      this.translateService.get("PPT.confirmBox_msg")["value"];
    this.confirmBox_ok =
      this.translateService.get("PPT.confirmBox_ok")["value"];
    this.confirmBox_cancel = this.translateService.get("PPT.confirmBox_cancel")[
      "value"
    ];

    this.res = this.navParams.data.res;
    console.log("Res-->", this.res);

    this.all_districts = this.res.districts_arr;
    this.all_blocks = this.res.blocks_arr;

    this._id = this.res.profileObj[0]._id;
    this.name = this.res.profileObj[0].username;
    this.gender = this.res.profileObj[0].gender;
    this.dob = this.res.profileObj[0].dob;
    this.phone = this.res.profileObj[0].contactnumber;
    this.image_preview = this.res.profileObj[0].image;
    this.selected_qualification = this.res.profileObj[0].qualification;

    this.selected_stateid = this.res.profileObj[0].stateid;
    this.selected_statename = this.res.profileObj[0].statename
      ? this.res.profileObj[0].statename
      : "odisha";
    this.selected_districtid = this.res.profileObj[0].districtid;
    this.selected_districtname = this.res.profileObj[0].districtname;
    this.selected_blockid = this.res.profileObj[0].blockid;
    this.selected_blockname = this.res.profileObj[0].blockname;
    this.address = this.res.profileObj[0].permanentaddress;
    console.log("---->>>", this.selected_stateid, this.selected_statename);
  }

  ngOnInit(): void {}

  initialize_fields() {}

  edu_list = [
    { education: "Matriculation" },
    { education: "Intermediate" },
    { education: "Bachelor of Arts" },
    { education: "Bachelor of Commerce" },
    { education: "Bachelor of Science" },
    { education: "Bachelor of Technology" },
    { education: "Masters" },
    { education: "Post Graduation" },
  ];

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    }
  }

  //Halfmodal opening
  async openOptionSelection() {
    const modal = await this.modalController.create({
      component: EditprofilemodalPage,
      cssClass: "transparent-modal",
    });
    modal.onDidDismiss().then((res) => {
      // console.log(res);
      if (res.role !== "backdrop") {
        if (res.data === "Photos") {
          this.ChooseGallery();
        } else if (res.data === "Camera") {
          this.ChooseCamera();
        } else {
          this.image_preview = null;
        }
      }
    });
    return await modal.present();
  }

  //Chosing Galary
  ChooseGallery() {
    this.camera
      .getPicture({
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 400,
        targetHeight: 400,
        allowEdit: true,
        correctOrientation: true,
      })
      .then((imageData) => {
        this.imageData = imageData;
        this.image_preview = this.domSanitizer.bypassSecurityTrustResourceUrl(
          "data:image/jpg;base64," + imageData
        );
        // const imageName = this.s3name + ".jpeg";
        // const imageBlob = this.dataURItoBlob(imageData);
        // const imageFile = new File([imageBlob], imageName, {
        //   type: "image/jpeg",
        // });
        // console.log(imageFile, imageFile.name);

        // this.fileUploadtoS3(imageFile, null, imageName);
      })
      .catch((err) => {
        alert("error " + JSON.stringify(err));
      });
  }

  // Chosing Camera
  ChooseCamera() {
    const options: CameraOptions = {
      // quality: 100,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      // targetWidth: 400,
      // targetHeight: 400,
      // correctOrientation: true,
      quality: 100,
      correctOrientation: true,
      targetWidth: 400,
      targetHeight: 400,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        // this.imageData = imageData;

        // this.image_preview = this.domSanitizer.bypassSecurityTrustResourceUrl(
        //   "data:image/jpg;base64," + imageData
        // );
        // const imageName = this.s3name + ".jpeg";
        // const imageBlob = this.dataURItoBlob(this.image_preview);
        // const imageFile = new File([imageBlob], imageName, {
        //   type: "image/jpeg",
        // });
        // this.fileUploadtoS3(imageFile, null, imageName);
        // needs to import file plugin
        // split the file and the path from FILE_URI result
        // console.log("image_data", JSON.stringify(imageData));
        let filename = imageData.substring(imageData.lastIndexOf("/") + 1);
        let path = imageData.substring(0, imageData.lastIndexOf("/") + 1);
        // console.log("filename", filename);
        // console.log("path", path);
        //then use the method reasDataURL  btw. var_picture is ur image variable
        const newBaseFilesystemPath = this.file.dataDirectory;
        this.file.copyFile(path, filename, newBaseFilesystemPath, filename);
        const storedPhoto = newBaseFilesystemPath + filename;
        // console.log("storedPhoto", storedPhoto);
        const resolvedImg = this.webView.convertFileSrc(storedPhoto);
        // console.log("resolved image", resolvedImg);
        // this.safeImg =
        //   this.domSanitizer.bypassSecurityTrustResourceUrl(resolvedImg);
        // console.log("image-->", this.safeImg);

        // this.file
        //   .readAsDataURL(path, filename)
        //   .then((res) => (this.var_picture = res));
        // console.log(this.var_picture);
        this.fileUploadtoS3(resolvedImg, null, filename);
      },
      (err) => {
        alert("error " + JSON.stringify(err));
      }
    );
  }

  //Data URI to Blob
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }

  //Upload to S3 Bucket
  fileUploadtoS3(file, directory, filename) {
    this.imageuploadService
      .pushFileToStorage(file, directory, filename)
      .subscribe((event) => {
        alert("$$$event: " + JSON.stringify(event));
        if (event instanceof HttpResponse) {
          this.s3path = event.body["s3path"];
          alert("File is completely uploaded!->" + this.s3path);
        } else {
          this.s3path = "";
        }
      });
  }

  gender_onchange(value) {
    this.gender = value;
  }

  dob_onhange(value) {
    this.block = value;
  }

  block_onhange(value) {
    this.dob = value;
  }

  // district_onChange(value) {
  //   this.selected_district = value;
  // }

  qualification_onhange(value) {
    this.selected_qualification = value;
  }

  selected_state_onChange(value) {
    this.selected_statename = value;
  }

  getname(id, name, arr) {
    var value = "";
    var newarr = arr.filter((e) => e._id == id);
    console.log("-->new arr: ", newarr);
    value = newarr ? newarr[0][name] : "";
    return value;
  }

  district_onchange(e) {
    console.log(e);
    this.selected_districtid = e.detail.value;
    this.selected_districtname = this.getname(
      this.selected_districtid,
      "districtname",
      this.all_districts
    );
    console.log(this.selected_districtname, this.selected_districtid);
    this.selected_blockid = "";
    this.selected_blockname = "";
    this.getAllBlockData(this.selected_stateid, this.selected_districtid);
  }

  block_onchange(e) {
    this.selected_blockid = e.detail.value;
    this.selected_blockname = this.getname(
      this.selected_blockid,
      "blockname",
      this.all_blocks
    );
    console.log(this.selected_blockid, this.selected_blockname);
  }

  async getAllBlockData(stateid, districtid) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    this.api.getBlockData(stateid, districtid).subscribe(
      (res) => {
        console.log("Blocks-->", res);
        loading.dismiss();
        this.all_blocks = res;
      },
      (err) => {
        console.log(err);
        this.all_blocks = [];
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async update_profile() {
    const details = {
      username: this.name,
      contactnumber: this.phone,
      gender: this.gender,
      dob: this.dob,
      permanentaddress: this.address,
      qualification: this.selected_qualification,
      statename: this.selected_statename,
      districtname: this.selected_districtname,
      blockname: this.selected_blockname,
      districtid: this.selected_districtid,
      stateid: this.odisha_id,
      blockid: this.selected_blockid,
    };

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    console.log(details);
    await this.api.updateprofile(this._id, details).subscribe(
      (res) => {
        // console.log("success", res);
        loading.dismiss();
        this.closeModal("save");
        if (res["status"]) {
          localStorage.setItem("_username", this.name);
          this.showAlert(this.msg_heading, "", this.msg_success);
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
        this.showAlert(this.msg_heading, "", this.msg_fail);
        this.serverDownMsg.presentToast();
      }
    );
  }

  save_button_click() {
    const phone_pattern = /^[6-9]\d{9}$/;
    if (this.name === undefined || this.name == null || this.name === "") {
      this.showAlert("Verify", "", "Please enter your name");
    } else if (
      this.gender === undefined ||
      this.gender == null ||
      this.gender === ""
    ) {
      this.showAlert("Verify", "", "Please select Gender");
      // } else if (
      //   this.image_preview === undefined ||
      //   this.image_preview == null ||
      //   this.image_preview === ""
      // ) {
      //   this.showAlert("Verify", "", "Please upload a profile photo");
    } else if (this.phone === undefined || this.phone == null) {
      this.showAlert("Verify", "", "Please enter Mobile number");
    } else if (!phone_pattern.test("" + this.phone)) {
      this.showAlert(
        "Verify",
        "",
        "Please enter a valid 10-digit Mobile number"
      );
    } else if (
      this.selected_qualification === undefined ||
      this.selected_qualification == null ||
      this.selected_qualification === ""
    ) {
      this.showAlert("Verify", "", "Please select your qualification");
    } /*else if (
      this.selected_statename === undefined ||
      this.selected_statename == null ||
      this.selected_statename === ""
    ) {
      this.showAlert("Verify", "", "Please select your State");
    }*/ else if (
      this.selected_districtname === undefined ||
      this.selected_districtname == null ||
      this.selected_districtname === ""
    ) {
      this.showAlert("Verify", "", "Please select your District");
    } else if (
      this.selected_blockname === undefined ||
      this.selected_blockname == null ||
      this.selected_blockname === ""
    ) {
      this.showAlert("Verify", "", "Please Enter your Block name");
    } /*else if (
      this.address === undefined ||
      this.address == null ||
      this.address === ""
    ) {
      this.showAlert("Verify", "", "Please enter your address");
    }*/ else {
      this.update_profile();
    }
  }

  closeModal(flag) {
    let dismissObj = {};
    if (flag === "cancel") dismissObj = { data: "cancel" };
    else dismissObj = { data: "save" };
    this.modalController.dismiss(dismissObj, "backdrop");
  }

  ngOnDestroy() {
    if (window.history.state.modal) {
      history.back();
    }
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  // confirm box
  async showConfirm(
    header: string,
    subHeader: string,
    message: string,
    body: any
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  async confirmBox(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: this.confirmBox_cancel,
          role: "cancel",
          handler: () => {},
        },
        {
          text: this.confirmBox_ok,
          handler: () => {
            this.closeModal("cancel");
          },
        },
      ],
    });
    await alert.present();
  }
}
