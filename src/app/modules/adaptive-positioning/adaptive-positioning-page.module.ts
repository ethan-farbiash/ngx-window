import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxWindowModule } from '../../../../projects/ngx-window/src/public-api';
import { AdaptivePositioningPageRoutingModule } from './adaptive-positioning-page-routing.module';
import { AdaptivePositioningPageComponent } from './adaptive-positioning-page.component';

@NgModule({
    imports: [
        CommonModule,
        NgxWindowModule,
        AdaptivePositioningPageRoutingModule
    ],
    declarations: [
        AdaptivePositioningPageComponent
    ]
})
export class AdaptivePositioningPageModule { }
