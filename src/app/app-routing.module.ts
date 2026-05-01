import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'drop-downs',
        loadChildren: () => import('./modules/drop-down/drop-down-page.module').then(m => m.DropDownPageModule)
    },
    {
        path: 'resize-and-move',
        loadChildren: () => import('./modules/resize-and-move/resize-and-move-page.module').then(m => m.ResizeAndMovePageModule)
    },
    {
        path: 'adaptive-positioning',
        loadChildren: () => import('./modules/adaptive-positioning/adaptive-positioning-page.module').then(m => m.AdaptivePositioningPageModule)
    },
    { path: '**', redirectTo: 'drop-downs', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
