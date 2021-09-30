import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home-results", pathMatch: "full" },
  {
    path: "landing",
    loadChildren: "./pages/landing/landing.module#LandingPageModule",
  },
  {
    path: "skillchartall1",
    loadChildren:
      "./pages/skillchartall1/skillchartall1.module#Skillchartall1PageModule",
  },
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginPageModule",
  },
  {
    path: "register",
    loadChildren: "./pages/register/register.module#RegisterPageModule",
  },
  {
    path: "about",
    loadChildren: "./pages/about/about.module#AboutPageModule",
  },
  {
    path: "settings",
    loadChildren: "./pages/settings/settings.module#SettingsPageModule",
  },
  {
    path: "edit-profile",
    loadChildren:
      "./pages/edit-profile/edit-profile.module#EditProfilePageModule",
  },
  {
    path: "home-results",
    loadChildren:
      "./pages/home-results/home-results.module#HomeResultsPageModule",
  },
  {
    path: "home-results2",
    loadChildren:
      "./pages/home-results2/home-results2.module#HomeResults2PageModule",
  },
  {
    path: "center",
    loadChildren: "./pages/center/center.module#CenterPageModule",
  },
  {
    path: "feedback",
    loadChildren: "./pages/feedback/feedback.module#FeedbackPageModule",
  },
  {
    path: "payment",
    loadChildren: "./pages/payment/payment.module#PaymentPageModule",
  },
  {
    path: "assessment",
    loadChildren: "./pages/assessment/assessment.module#AssessmentPageModule",
  },
  {
    path: "community",
    loadChildren: "./pages/community/community.module#CommunityPageModule",
  },
  {
    path: "issues",
    loadChildren: "./pages/issues/issues.module#IssuesPageModule",
  },
  {
    path: "expense",
    loadChildren: "./pages/expense/expense.module#ExpensePageModule",
  },
  {
    path: "message",
    loadChildren: "./pages/message/message.module#MessagePageModule",
  },
  {
    path: "student",
    loadChildren: "./pages/student/student.module#StudentPageModule",
  },
  {
    path: "studentexplor",
    loadChildren:
      "./pages/studentexplor/studentexplor.module#StudentExplorPageModule",
  },
  {
    path: "attendance",
    loadChildren: "./pages/attendance/attendance.module#AttendancePageModule",
  },
  {
    path: "tchpayment",
    loadChildren: "./pages/tchpayment/tchpayment.module#TchpaymentPageModule",
  },
  {
    path: "ecassessment",
    loadChildren:
      "./pages/ecassessment/ecassessment.module#EcassessmentPageModule",
  },
  {
    path: "pgassessment",
    loadChildren:
      "./pages/pgassessment/pgassessment.module#PgassessmentPageModule",
  },
  {
    path: "ecactivity",
    loadChildren: "./pages/ecactivity/ecactivity.module#EcactivityPageModule",
  },
  {
    path: "ecactivity1",
    loadChildren:
      "./pages/ecactivity1/ecactivity1.module#Ecactivity1PageModule",
  },
  {
    path: "ecactivity2",
    loadChildren:
      "./pages/ecactivity2/ecactivity2.module#Ecactivity2PageModule",
  },
  {
    path: "pgactivity",
    loadChildren: "./pages/pgactivity/pgactivity.module#PgactivityPageModule",
  },
  {
    path: "pgactivity2",
    loadChildren:
      "./pages/pgactivity2/pgactivity2.module#Pgactivity2PageModule",
  },
  {
    path: "pgactivityodia",
    loadChildren:
      "./pages/pgactivityodia/pgactivityodia.module#PgactivityodiaPageModule",
  },
  {
    path: "pgactivity2odia",
    loadChildren:
      "./pages/pgactivity2odia/pgactivity2odia.module#Pgactivity2odiaPageModule",
  },
  {
    path: "pgactivityeng",
    loadChildren:
      "./pages/pgactivityeng/pgactivityeng.module#PgactivityengPageModule",
  },
  {
    path: "pgemathactivity",
    loadChildren:
      "./pages/pgemathactivity/pgemathactivity.module#PgemathactivityPageModule",
  },
  {
    path: "pgeenglishactivity",
    loadChildren:
      "./pages/pgeenglishactivity/pgeenglishactivity.module#PgeenglishactivityPageModule",
  },
  {
    path: "pgeodiaactivity",
    loadChildren:
      "./pages/pgeodiaactivity/pgeodiaactivity.module#PgeodiaactivityPageModule",
  },
  {
    path: "pgeactivityskills",
    loadChildren:
      "./pages/pgeactivityskills/pgeactivityskills.module#PgeactivityskillsPageModule",
  },
  {
    path: "pgeactivitycontents",
    loadChildren:
      "./pages/pgeactivitycontents/pgeactivitycontents.module#PgeactivitycontentsPageModule",
  },
  {
    path: "pgactivity2eng",
    loadChildren:
      "./pages/pgactivity2eng/pgactivity2eng.module#Pgactivity2engPageModule",
  },
  {
    path: "showpushnotification/:message",
    loadChildren:
      "./pages/showpushnotification/showpushnotification.module#ShowpushnotificationPageModule",
  },
  {
    path: "file-display",
    loadChildren:
      "./pages/file-display/file-display.module#FileDisplayPageModule",
  },
  {
    path: "training1",
    loadChildren: "./pages/training1/training1.module#Training1PageModule",
  },
  {
    path: "training2",
    loadChildren: "./pages/training2/training2.module#Training2PageModule",
  },
  {
    path: "profile",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
  },
  {
    path: "studentregister",
    loadChildren:
      "./pages/studentregister/studentregister.module#StudentregisterPageModule",
  },
  {
    path: "userfeedback",
    loadChildren:
      "./pages/userfeedback/userfeedback.module#UserfeedbackPageModule",
  },
  {
    path: "trainingsubs",
    loadChildren: "./trainingsubs/trainingsubs.module#TrainingsubsPageModule",
  },
  { path: "quiz", loadChildren: "./quiz/quiz.module#QuizPageModule" },
  {
    path: "preview",
    loadChildren: "./preview/preview.module#PreviewPageModule",
  },
  {
    path: "trainingcontentpreview",
    loadChildren:
      "./trainingcontentpreview/trainingcontentpreview.module#TrainingcontentpreviewPageModule",
  },
  {
    path: "skillchartall1",
    loadChildren:
      "./pages/skillchartall1/skillchartall1.module#Skillchartall1PageModule",
  },
  {
    path: "tzworkshop",
    loadChildren: "./pages/tzworkshop/tzworkshop.module#TzworkshopPageModule",
  },
  {
    path: "tzworkstart",
    loadChildren:
      "./pages/tzworkstart/tzworkstart.module#TzworkstartPageModule",
  },
  {
    path: "tzworkleap",
    loadChildren: "./pages/tzworkleap/tzworkleap.module#TzworkleapPageModule",
  },
  {
    path: "tzscrollcontent",
    loadChildren:
      "./pages/tzscrollcontent/tzscrollcontent.module#TzscrollcontentPageModule",
  },
  {
    path: "tzworkschool",
    loadChildren:
      "./pages/tzworkschool/tzworkschool.module#TzworkschoolPageModule",
  },
  {
    path: "tzschoolstart",
    loadChildren:
      "./pages/tzschoolstart/tzschoolstart.module#TzschoolstartPageModule",
  },
  { path: "", loadChildren: "./pages/tabs/tabs.module#TabsPageModule" },
  {
    path: "studentdetails",
    loadChildren:
      "./pages/studentdetails/studentdetails.module#StudentdetailsPageModule",
  },
  {
    path: "studentassessment1",
    loadChildren:
      "./pages/studentassessment1/studentassessment1.module#Studentassessment1PageModule",
  },
  {
    path: "skillchart-table",
    loadChildren:
      "./pages/skillchart-table/skillchart-table.module#SkillchartTablePageModule",
  },
  {
    path: "manager-box",
    loadChildren: "./pages/manager/manager.module#ManagerPageModule",
  },
  {
    path: "manager-folderview",
    loadChildren:
      "./pages/managerfolderview/managerfolderview.module#ManagerfolderviewPageModule",
  },
  {
    path: "extraresources",
    loadChildren:
      "./pages/extraresources/extraresources.module#ExtraresourcesPageModule",
  },
  {
    path: "terms-and-conditions",
    loadChildren:
      "./terms-and-conditions/terms-and-conditions.module#TermsAndConditionsPageModule",
  },
  {
    path: "general-instructions",
    loadChildren:
      "./general-instructions/general-instructions.module#GeneralInstructionsPageModule",
  },
  {
    path: "general-instructions-pge",
    loadChildren:
      "./general-instructions-pge/general-instructions-pge.module#GeneralInstructionsPgePageModule",
  },
  {
    path: "gallary-model",
    loadChildren: "./gallary-model/gallary-model.module#GallaryModelPageModule",
  },
  { path: "tools", loadChildren: "./tools/tools.module#ToolsPageModule" },
  {
    path: "feedback_new",
    loadChildren: "./feedback/feedback.module#FeedbackPageModule",
  },
  {
    path: "dictionary",
    loadChildren: "./dictionary/dictionary.module#DictionaryPageModule",
  },
  {
    path: "trainingcontent",
    loadChildren:
      "./pages/trainingcontent/trainingcontent.module#TrainingcontentPageModule",
  },
  {
    path: "topiccontent",
    loadChildren:
      "./pages/topiccontent/topiccontent.module#TopiccontentPageModule",
  },
  {
    path: "contentdetails",
    loadChildren:
      "./pages/contentdetails/contentdetails.module#ContentDetailsPageModule",
  },
  {
    path: "assesmentprogram",
    loadChildren:
      "./pages/assesmentprogram/assesmentprogram.module#AssesmentProgramPageModule",
  },
  {
    path: "ecelevel",
    loadChildren: "./pages/ecelevel/ecelevel.module#EceLevelPageModule",
  },
  {
    path: "pgelevel",
    loadChildren: "./pages/pgelevel/pgelevel.module#PgeLevelPageModule",
  },
  {
    path: "ece",
    loadChildren: "./pages/ece/ece.module#EceProgramPagePageModule",
  },
  {
    path: "pge",
    loadChildren: "./pages/pge/pge.module#PgeProgramPagePageModule",
  },
  {
    path: "teacherassesment",
    loadChildren:
      "./pages/teacherassesment/teacherassesment.module#TeacherAssesmentPageModule",
  },
  {
    path: "trainingfiles",
    loadChildren:
      "./pages/trainingfiles/trainingfiles.module#TrainingFilePageModule",
  },
  {
    path: "pgassessmenttraining",
    loadChildren:
      "./pages/trainingpgassessment/trainingpgassessment.module#PgassessmentTrainingPageModule",
  },
  {
    path: "ppttrainingcontent",
    loadChildren:
      "./pages/ppttrainingcontent/ppttrainingcontent.module#PPTTrainingcontentPageModule",
  },
  {
    path: "ppttopiccontent",
    loadChildren:
      "./pages/ppttopiccontent/ppttopiccontent.module#PPTTopiccontentPageModule",
  },
  {
    path: "pptcontentdetails",
    loadChildren:
      "./pages/pptcontentdetails/pptcontentdetails.module#PPTContentDetailsPageModule",
  },
  {
    path: "pptquiz",
    loadChildren: "./pages/pptquiz/pptquiz.module#PPTQuizPageModule",
  },
  {
    path: "trainingcontentquiz",
    loadChildren:
      "./pages/trainingcontentquiz/trainingcontentquiz.module#TrainingcontentquizPageModule",
  },
  {
    path: "teacherbaselinedndline",
    loadChildren:
      "./pages/teacherbaselinedndline/teacherbaselinedndline.module#TeacherBaselinePageModule",
  },
  {
    path: "hbl",
    loadChildren: "./pages/hbl/hbl.module#HblPageModule",
  },
  {
    path: "hbl-activity",
    loadChildren:
      "./pages/hbl-activity/hbl-activity.module#HblActivityPageModule",
  },
  {
    path: "hbl-register",
    loadChildren:
      "./pages/hbl-register/hbl-register.module#HblRegisterPageModule",
  },
  {
    path: "hbl-assessment",
    loadChildren:
      "./pages/hbl-assessment/hbl-assessment.module#HblAssessmentPageModule",
  },
  {
    path: "hbl-quiz",
    loadChildren: "./pages/hbl-quiz/hbl-quiz.module#HblQuizPageModule",
  },
  {
    path: "hbl-pdfviewer",
    loadChildren:
      "./pages/hbl-pdfviewer/hbl-pdfviewer.module#HblPdfviewerPageModule",
  },
  {
    path: "pgeactivitymodal",
    loadChildren:
      "./pages/modal/pgeactivitymodal/pgeactivitymodal.module#PgeactivitymodalPageModule",
  },
  {
    path: "pgeactivitymodal",
    loadChildren:
      "./pages/modal/pgeactivitymodal/pgeactivitymodal.module#PgeactivitymodalPageModule",
  },
  {
    path: "hrpolicy",
    loadChildren: "./pages/modal/hrpolicy/hrpolicy.module#HrpolicyPageModule",
  },
  {
    path: "eceselectclassmodal",
    loadChildren:
      "./pages/modal/eceselectclassmodal/eceselectclassmodal.module#EceselectclassmodalPageModule",
  },
  {
    path: "leaderboard",
    loadChildren:
      "./pages/leaderboard/leaderboard.module#LeaderboardPageModule",
  },
  {
    path: "performance",
    loadChildren:
      "./pages/indivisual-user-performance/indivisual-user-performance.module#IndivisualUserPerformancePageModule",
  },
  {
    path: "callresponse",
    loadChildren:
      "./pages/callresponse/callresponse.module#CallresponsePageModule",
  },
  {
    path: "callresponsequestions",
    loadChildren:
      "./pages/callresponsequestions/callresponsequestions.module#CallresponsequestionsPageModule",
  },
  {
    path: "callresponsereport",
    loadChildren:
      "./pages/callresponsereport/callresponsereport.module#CallresponsereportPageModule",
  },
  {
    path: "editprofilemodal",
    loadChildren:
      "./pages/modal/editprofilemodal/editprofilemodal.module#EditprofilemodalPageModule",
  },
  {
    path: "statusmodal",
    loadChildren:
      "./pages/modal/statusmodal/statusmodal.module#StatusmodalPageModule",
  },
  {
    path: "statusmodal1",
    loadChildren:
      "./pages/modal/statusmodal1/statusmodal1.module#Statusmodal1PageModule",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
