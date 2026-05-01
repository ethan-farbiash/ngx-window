import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdaptivePositioningPageComponent } from './adaptive-positioning-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdaptivePositioningPageComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class AdaptivePositioningPageRoutingModule { }
