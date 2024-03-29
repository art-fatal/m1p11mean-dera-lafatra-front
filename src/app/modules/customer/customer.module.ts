import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';
import {CustomerRoutingModule} from "./customer-routing.module";
import {DropdownMenusModule, ExtrasModule, WidgetsModule} from "../../_metronic/partials";
import { HomeComponent } from './home/home.component';
import { FilterButtonComponent } from './home/filter-button/filter-button.component';
import {SharedModule} from "../../_metronic/shared/shared.module";
import { PreferenceComponent } from './preference/preference.component';

@NgModule({
  declarations: [CustomerComponent, AppointmentHistoryComponent, HomeComponent, FilterButtonComponent, PreferenceComponent],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        CustomerRoutingModule,
        WidgetsModule,
        DropdownMenusModule,
        SharedModule,
        ExtrasModule,
    ],
})
export class CustomerModule {}
