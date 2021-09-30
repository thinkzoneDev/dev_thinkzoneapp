import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// Modal Pages
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ImagePageModule } from "./pages/modal/image/image.module";
import { SearchFilterPageModule } from "./pages/modal/search-filter/search-filter.module";
import { SigninPageModule } from "./pages/modal/signin/signin.module";
import { MessagebodyPageModule } from "./pages/modal/messagebody/messagebody.module";
import { ExpensemodalPageModule } from "./pages/modal/expensemodal/expensemodal.module";
import { BaselinePageModule } from "./pages/modal/baseline/baseline.module";
import { EndlinePageModule } from "./pages/modal/endline/endline.module";
import { AttendancemodalPageModule } from "./pages/modal/attendancemodal/attendancemodal.module";
import { AttendancehistorymodalPageModule } from "./pages/modal/attendancehistorymodal/attendancehistorymodal.module";
import { HolidaymodalPageModule } from "./pages/modal/holidaymodal/holidaymodal.module";
import { ViewpaymentPageModule } from "./pages/modal/viewpayment/viewpayment.module";
import { MakepaymentPageModule } from "./pages/modal/makepayment/makepayment.module";
import { EceassessmentmodalPageModule } from "./pages/modal/eceassessmentmodal/eceassessmentmodal.module";
import { PptsubmitmodalPageModule } from "./pages/modal/pptsubmitmodal/pptsubmitmodal.module";
import { PgeengassessmentmodalPageModule } from "./pages/modal/pgeengassessmentmodal/pgeengassessmentmodal.module";
import { PgemathassessmentmodalPageModule } from "./pages/modal/pgemathassessmentmodal/pgemathassessmentmodal.module";
import { StudentregisterPageModule } from "./pages/studentregister/studentregister.module";
import { Studentassessment2PageModule } from "./pages/studentassessment2/studentassessment2.module";
import { SkillchartTablePageModule } from "./pages/skillchart-table/skillchart-table.module";
import { TermsAndConditionsPageModule } from "./terms-and-conditions/terms-and-conditions.module";
import { ContentdetailsmodalPageModule } from "./pages/modal/contentdetailsmodal/contentdetailsmodal.module";

import { Training2PageModule } from "./pages/training2/training2.module";

// Components
import { NotificationsComponent } from "./components/notifications/notifications.component";

// Camera
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";

// to access sd card
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

// file system access
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

// Ionic Native Media plugin
import { Media } from "@ionic-native/media/ngx";

// video player
import { VideoPlayer } from "@ionic-native/video-player/ngx";

// Push Notification FCM(Firebase Cloud Messaging)
import { FCM } from "@ionic-native/fcm/ngx";
import { CommonModule } from "@angular/common";

import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

// Ionic Auto-complete
import { AutoCompleteModule } from "ionic4-auto-complete";

import { FormsModule } from "@angular/forms";
// Translate
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateConfigService } from "./translate-config.service";
import { QuizPageModule } from "./quiz/quiz.module";

// Google Signin
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "angularx-social-login";

// Offline
import { IonicStorageModule } from "@ionic/storage";
import { Network } from "@ionic-native/network/ngx";

import { CallNumber } from "@ionic-native/call-number/ngx";

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

// market plugin used for using native google playstore
import { Market } from "@ionic-native/market/ngx";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { SyncappPageModule } from "./pages/modal/syncapp/syncapp.module";
import { GallaryModelPageModule } from "./gallary-model/gallary-model.module";
import { GeneralInstructionsPageModule } from "./general-instructions/general-instructions.module";
import { GeneralInstructionsPgePageModule } from "./general-instructions-pge/general-instructions-pge.module";
import { from } from "rxjs";
import { ContentDetailsPageModule } from "./pages/contentdetails/contentdetails.module";
import { HblAssessmentPageModule } from "./pages/hbl-assessment/hbl-assessment.module";
import { HblQuizPageModule } from "./pages/hbl-quiz/hbl-quiz.module";
import { HblPopoverComponent } from "./pages/hbl-popover/hbl-popover.component";
import { HblRegisterPageModule } from "./pages/hbl-register/hbl-register.module";
import { HblPdfviewerPage } from "./pages/hbl-pdfviewer/hbl-pdfviewer.page";
import { UpdatepagePage } from "./updatepage/updatepage.page";
import { PgeactivitymodalPage } from "./pages/modal/pgeactivitymodal/pgeactivitymodal.page";
import { EditProfilePage } from "./pages/edit-profile/edit-profile.page";
import { EceselectclassmodalPage } from "./pages/modal/eceselectclassmodal/eceselectclassmodal.page";
import { CallresponsequestionsPageModule } from "./pages/callresponsequestions/callresponsequestions.module";
import { CallresponsePageModule } from "./pages/callresponse/callresponse.module";
import { EditprofilemodalPage } from "./pages/modal/editprofilemodal/editprofilemodal.page";
import { Crop } from "@ionic-native/crop/ngx";
import { StatusmodalPage } from "./pages/modal/statusmodal/statusmodal.page";
import { Statusmodal1Page } from "./pages/modal/statusmodal1/statusmodal1.page";
import { StudentregisterbytypePage } from "./pages/studentregisterbytype/studentregisterbytype.page";
import { EcassessmentPage } from "./pages/ecassessment/ecassessment.page";
import { PgassessmentPage } from "./pages/pgassessment/pgassessment.page";
import { IonicSelectableModule } from "ionic-selectable";

@NgModule({
  declarations: [
    AppComponent,
    NotificationsComponent,
    HblPopoverComponent,
    // HblPdfviewerPage,
    // UpdatepagePage,
    // PgeactivitymodalPage,
    // EceselectclassmodalPage,
    // EditProfilePage,
    // EditprofilemodalPage,
    // StatusmodalPage,
    // Statusmodal1Page,
    // StudentregisterbytypePage,
    // EcassessmentPage,
    //PgassessmentPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      scrollAssist: false,
    }),
    IonicSelectableModule,
    AppRoutingModule,
    HttpClientModule,
    ImagePageModule,
    SigninPageModule,
    SyncappPageModule,
    MessagebodyPageModule,
    ExpensemodalPageModule,
    SearchFilterPageModule,
    BaselinePageModule,
    EndlinePageModule,
    AttendancemodalPageModule,
    AttendancehistorymodalPageModule,
    HolidaymodalPageModule,
    ViewpaymentPageModule,
    MakepaymentPageModule,
    EceassessmentmodalPageModule,
    PptsubmitmodalPageModule,
    PgeengassessmentmodalPageModule,
    PgemathassessmentmodalPageModule,
    Studentassessment2PageModule,
    Training2PageModule,
    AutoCompleteModule,
    QuizPageModule,
    TermsAndConditionsPageModule,
    SkillchartTablePageModule,
    StudentregisterPageModule,
    GeneralInstructionsPageModule,
    GeneralInstructionsPgePageModule,
    GallaryModelPageModule,
    SocialLoginModule,
    ContentdetailsmodalPageModule,
    HblRegisterPageModule,
    HblAssessmentPageModule,
    HblQuizPageModule,
    PdfViewerModule,
    CallresponsePageModule,
    CallresponsequestionsPageModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot({
      name: "__mydb",
      driverOrder: ["indexeddb", "sqlite", "websql"],
    }),
  ],
  entryComponents: [
    NotificationsComponent,
    HblPopoverComponent,
    HblPdfviewerPage,
    UpdatepagePage,
    PgeactivitymodalPage,
    EditProfilePage,
    EditprofilemodalPage,
    StatusmodalPage,
    Statusmodal1Page,
    StudentregisterbytypePage,
    EcassessmentPage,
    PgassessmentPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    Geolocation,
    File,
    DocumentViewer,
    InAppBrowser,
    FileOpener,
    Diagnostic,
    VideoPlayer,
    FCM,
    GooglePlus,
    WebView,
    Media,
    ScreenOrientation,
    FileTransfer,
    FileTransferObject,
    Network,
    Market,
    CallNumber,
    Crop,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "241519412611-btifq46eoq3v14ql3sep5qiemophu2gj.apps.googleusercontent.com"
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
