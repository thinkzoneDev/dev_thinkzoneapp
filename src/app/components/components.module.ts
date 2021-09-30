import { NgModule } from '@angular/core';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';
import { CommonModule } from '@angular/common';
import { ActivitySelectorComponent } from './activity-selector/activity-selector.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { StudentInfoChartComponent } from './student-info-chart/student-info-chart.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule.forRoot(),
        TranslateModule.forChild()],
    declarations: [PeriodSelectorComponent, ActivitySelectorComponent, StudentInfoChartComponent],
    exports: [PeriodSelectorComponent, ActivitySelectorComponent]
})

export class ComponentsModule {

}
