import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatRadioModule,
  MatTabsModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatGridListModule

} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BusinessRoutingModule } from './business-routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ngx-currency/src/currency-mask.config";
import { GradeComponent } from '../../components/common/grade/grade.component';
import { CommonPipesModule } from '../../pipes/common/common-pipes.module';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { CustomerGroupFormComponent } from './customer-groups/customer-group-form/customer-group-form.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomersFormsComponent } from './customers/customers-forms/customers-forms.component';
import { unitsComponent } from './units/units.component';
import { unitsFormComponent } from './units/units-form/units-form.component';
import { AreasComponent } from './areas/areas.component';
import { AreasFormComponent } from './areas/areas-form/areas-form.component';
import { AspectsComponent } from './aspects/aspects.component';
import { AspectsFormComponent } from './aspects/aspects-form/aspects-form.component';
import { DocumentsComponent } from './documents/documents.component';
import { DocumentsFormComponent } from './documents/documents-form/documents-form.component';
import { HomeComponent } from './home/home.component';
import { DocumentItemComponent } from './documents/document-item/document-item.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { AuditFormComponent } from './requirements/audits-form/audits-form.component';
import { UsersComponent } from './users/users.component';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { FileFieldComponent } from "./../../components/common/file-field/file-field.component";
import { DocumentsAttachementFormComponent } from './documents/documents-attachement-form/documents-attachement-form.component';
import { unitsResponsibleFormComponent } from './units/units-responsible-form/units-responsible-form.component';
import { ActionPlanFormComponent } from './requirements/action-plan-form/action-plan-form.component';
import { AttachmentsDownloadComponent } from './requirements/attachments-download/attachments-download.component';
import { AuditsAttachmentFormComponent } from './requirements/audits-attachment-form/audits-attachment-form.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from 'app/components/common/chart/chart.component';
import { HighchartsChartComponent } from "highcharts-angular";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

@NgModule({
  imports: [NgxUpperCaseDirectiveModule,
    CommonModule,
    ReactiveFormsModule,
    CommonPipesModule,
    FormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatRadioModule,
    MatTabsModule,
    NgxCurrencyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
    BusinessRoutingModule,
    ChartsModule,
    MatProgressBarModule,
    MatGridListModule,
    // MaterialFileInputModule,
  ],
  declarations: [
    GradeComponent,
    CustomerGroupsComponent, CustomerGroupFormComponent,
    CustomersComponent, CustomersFormsComponent,
    unitsComponent,
    unitsFormComponent,
    AreasComponent,
    AreasFormComponent, AspectsComponent, AspectsFormComponent, DocumentsComponent, DocumentsFormComponent,
    HomeComponent,
    DocumentItemComponent,
    RequirementsComponent,
    AuditFormComponent,
    UsersComponent, UsersFormComponent, FileFieldComponent, DocumentsAttachementFormComponent, unitsResponsibleFormComponent, ActionPlanFormComponent, AttachmentsDownloadComponent, AuditsAttachmentFormComponent, DashboardComponent,
    ChartComponent,
    HighchartsChartComponent
  ],
  exports: [MatAutocompleteModule],
  entryComponents: [CustomerGroupFormComponent,
    CustomersFormsComponent, unitsFormComponent, AreasFormComponent, AspectsFormComponent, DocumentsFormComponent, DocumentsAttachementFormComponent,
    DocumentItemComponent, AuditFormComponent, UsersFormComponent, unitsResponsibleFormComponent, ActionPlanFormComponent,AttachmentsDownloadComponent, AuditsAttachmentFormComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]

})
export class BusinessModule { }
