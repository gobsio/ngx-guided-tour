import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GuidedTourStep } from '../constants/guided-tour-step.model';
import { Orientation } from '../constants/guided-tour-orientation.model';

@Injectable()
export class GuidedTourStepService {

  constructor(@Inject(DOCUMENT) private dom: any) { }

  public isDialogOrientationLeft(guidedTourStep: GuidedTourStep): boolean {
    return !guidedTourStep.orientation
      || guidedTourStep.orientation === Orientation.Left
      || guidedTourStep.orientation === Orientation.TopLeft
      || guidedTourStep.orientation === Orientation.BottomLeft;
  }

  public isDialogOrientationRight(guidedTourStep: GuidedTourStep): boolean {
    return !guidedTourStep.orientation
      || guidedTourStep.orientation === Orientation.Right
      || guidedTourStep.orientation === Orientation.TopRight
      || guidedTourStep.orientation === Orientation.BottomRight;
  }

  public isDialogOrientationTop(guidedTourStep: GuidedTourStep): boolean {
    return !guidedTourStep.orientation
      || guidedTourStep.orientation === Orientation.Top
      || guidedTourStep.orientation === Orientation.TopRight
      || guidedTourStep.orientation === Orientation.TopLeft;
  }

  public isDialogOrientationBottom(guidedTourStep: GuidedTourStep): boolean {
    return guidedTourStep.orientation
      && (guidedTourStep.orientation === Orientation.Bottom
        || guidedTourStep.orientation === Orientation.BottomLeft
        || guidedTourStep.orientation === Orientation.BottomRight);
  }

}
