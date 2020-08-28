import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { NgxGuidedTourComponent } from './ngx-guided-tour.component';
import { WindowRefService } from './services/windowref.service';
import { CommonModule } from '@angular/common';
import { GuidedTourService } from './services/guided-tour.service';
import { GuidedTourStepService } from './services/guided-tour-step.service';

@NgModule({
  declarations: [
    NgxGuidedTourComponent
  ],
  providers: [
    WindowRefService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxGuidedTourComponent
  ]
})
export class NgxGuidedTourModule {
  public static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: NgxGuidedTourModule,
      providers: [
        ErrorHandler,
        GuidedTourService,
        GuidedTourStepService,
        WindowRefService
      ]
    };
  }
}
