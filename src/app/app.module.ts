import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWindowModule } from '../../projects/ngx-window/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LinkComponent } from './link.component';
import { AdaptivePositioningPageModule } from './modules/adaptive-positioning/adaptive-positioning-page.module';
import { DropDownPageModule } from './modules/drop-down/drop-down-page.module';
import { ResizeAndMovePageModule } from './modules/resize-and-move/resize-and-move-page.module';

@NgModule({
  declarations: [
    AppComponent,
    LinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxWindowModule,
    AdaptivePositioningPageModule,
    DropDownPageModule,
    ResizeAndMovePageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
