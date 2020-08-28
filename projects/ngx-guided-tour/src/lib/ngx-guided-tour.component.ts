import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { GuidedTourStep } from './constants/guided-tour-step.model';
import { Orientation } from './constants/guided-tour-orientation.model';
import { GuidedTourStepService } from './services/guided-tour-step.service';
import { GuidedTourService } from './services/guided-tour.service';
import { WindowRefService } from './services/windowref.service';
import { ViewportUtilities } from './utils/viewport.utilities';

@Component({
  selector: 'ngx-guided-tour',
  templateUrl: './ngx-guided-tour.component.html',
  styleUrls: ['./ngx-guided-tour.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxGuidedTourComponent implements AfterViewInit, OnDestroy {

  @Input()
  public minimalTourStepWidth = 200;

  @Input()
  public tourStepWidth = 300;

  @Input()
  public topOfPageAdjustment = 0;
  //
  //
  //

  @Input()
  public skipText = 'Pular';

  @Input()
  public nextText = 'Próximo';

  @Input()
  public doneText = 'Pronto';

  @Input()
  public closeText = 'Fechar';

  @Input()
  public backText = 'Voltar';

  //
  //
  //

  /**
   * The tour step dialog element reference.
   */
  @ViewChild('tourStep', { static: false })
  public tourStepRef: ElementRef;

  /**
   * The current step of the tour.
   */
  public currentTourStep: GuidedTourStep = null;

  /*
   * The referenced html element rect (selector).
   */
  public selectedElementRect: DOMRect = null;

  /*
   * Resizing & Scrolling Events.
   */
  private resizeSubscription: Subscription;
  private scrollSubscription: Subscription;

  //
  private defaultHighlightPadding = 4;

  constructor(
    @Inject(DOCUMENT) private dom: any,
    private windowRefService: WindowRefService,
    private guidedTourService: GuidedTourService,
    private guidedTourStepService: GuidedTourStepService
  ) {

  }

  private isDialogOrientationLeft(guidedTourStep: GuidedTourStep = this.currentTourStep): boolean {
    return this.guidedTourStepService.isDialogOrientationLeft(guidedTourStep);
  }

  private isDialogOrientationRight(guidedTourStep: GuidedTourStep = this.currentTourStep): boolean {
    return this.guidedTourStepService.isDialogOrientationRight(guidedTourStep);
  }

  private isDialogOrientationTop(guidedTourStep: GuidedTourStep = this.currentTourStep): boolean {
    return this.guidedTourStepService.isDialogOrientationTop(guidedTourStep);
  }

  private isDialogOrientationBottom(guidedTourStep: GuidedTourStep = this.currentTourStep): boolean {
    return this.guidedTourStepService.isDialogOrientationBottom(guidedTourStep);
  }

  private isDialogInViewport(): boolean {
    const selectedElement: HTMLElement = this.dom.querySelector(this.currentTourStep.selector);
    const dialogElement: HTMLElement = this.tourStepRef.nativeElement;
    return dialogElement
      && ViewportUtilities.elementInViewport(selectedElement)
      && ViewportUtilities.elementInViewport(dialogElement);
  }

  /**
   * Method responsible for getting the start pixel (left)
   * to position the modal next to the referenced element.
   * <p>
   * if Orientation.Left, dialog has to be the subtraction of the subtraction of
   *     (dialogWidth - the selectedElementWidth - the padding adjustment).
   * if Orientation.TopLeft, Orientation.BottomLeft
   *     dialog will start at same pixel as the selected element.
   *
   */
  private get calculatedLeftPosition(): number {
    if (this.isDialogOrientationLeft()) {
      if (this.currentTourStep.orientation === Orientation.Left) {
        return this.selectedElementRect.left - this.tourStepWidth - this.highlightPadding;
      } else {
        return (this.selectedElementRect.left);
      }
    }
    if (this.isDialogOrientationRight()) {
      if (this.currentTourStep.orientation === Orientation.Right) {
        return (this.selectedElementRect.left + this.selectedElementRect.width + this.highlightPadding);
      } else {
        return (this.selectedElementRect.right - this.tourStepWidth);
      }
    }
    return (this.selectedElementRect.right - (this.selectedElementRect.width / 2) - (this.tourStepWidth / 2));
  }

  // the diference between the minWidth and actual width.
  private get maxWidthAdjustmentForTourStep(): number {
    return this.tourStepWidth - this.minimalTourStepWidth;
  }

  private get widthAdjustmentForScreenBound(): number {
    if (!this.tourStepRef) {
      return 0;
    }
    let adjustment = 0;
    if (this.calculatedLeftPosition < 0) {
      adjustment = -this.calculatedLeftPosition;
    }
    if (this.calculatedLeftPosition > this.windowRefService.nativeWindow.innerWidth - this.tourStepWidth) {
      adjustment = this.calculatedLeftPosition - (this.windowRefService.nativeWindow.innerWidth - this.tourStepWidth);
    }

    return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
  }

  public get calculatedTourStepWidth(): number {
    return this.tourStepWidth - this.widthAdjustmentForScreenBound;
  }

  public scrollToAndSetElement(): void {
    this.updateStepLocation();
    // Allow things to render to scroll to the correct location
    setTimeout(() => {
      if (!this.isDialogInViewport()) {
        // verifica se possui elemento selecionado
        console.log(this.selectedElementRect);
        if (this.selectedElementRect && this.isDialogOrientationBottom()) {
          const nativeWindow = this.windowRefService.nativeWindow;
          // Scroll so the element is on the top of the screen.

          const topPos = ((nativeWindow.scrollY + this.selectedElementRect.top) - this.topOfPageAdjustment)
            - (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
            + this.getStepScreenAdjustment();
          try {
            this.windowRefService.nativeWindow.scrollTo({
              left: null,
              top: topPos,
              behavior: 'smooth'
            });
          } catch (err) {
            if (err instanceof TypeError) {
              this.windowRefService.nativeWindow.scroll(0, topPos);
            } else {
              throw err;
            }
          }
        } else {
          // Scroll so the element is on the bottom of the screen.
          const topPos = (this.windowRefService.nativeWindow.scrollY + this.selectedElementRect.top + this.selectedElementRect.height)
            - this.windowRefService.nativeWindow.innerHeight
            + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
            - this.getStepScreenAdjustment();
          try {
            this.windowRefService.nativeWindow.scrollTo({
              left: null,
              top: topPos,
              behavior: 'smooth'
            });
          } catch (err) {
            if (err instanceof TypeError) {
              this.windowRefService.nativeWindow.scroll(0, topPos);
            } else {
              throw err;
            }
          }
        }
      }
    });
  }

  public backdropClick(event: Event): void {
    if (this.guidedTourService.preventBackdropFromAdvancing) {
      event.stopPropagation();
    } else {
      this.guidedTourService.nextStep();
    }
  }

  public updateStepLocation(): void {
    if (this.currentTourStep && this.currentTourStep.selector) {
      const selectedElement = this.dom.querySelector(this.currentTourStep.selector);
      if (selectedElement && typeof selectedElement.getBoundingClientRect === 'function') {
        this.selectedElementRect = (selectedElement.getBoundingClientRect() as DOMRect);
      } else {
        this.selectedElementRect = null;
      }
    } else {
      this.selectedElementRect = null;
    }
  }

  public get transform(): string {
    if (this.isDialogOrientationTop()) {
      return 'translateY(-100%)';
    }
    return null;
  }

  public get dialog(): any {
    const rect: any = { top: null, left: null };
    if (this.currentTourStep.selector && this.selectedElementRect) {
      const paddingAdjustment = this.highlightPadding;
      if (this.isDialogOrientationBottom()) {
        rect.top = this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
      } else {
        rect.top = this.selectedElementRect.top - this.highlightPadding;
      }
      if (this.calculatedLeftPosition >= 0) {
        rect.left = this.calculatedLeftPosition;
      } else {
        const adjustment = Math.max(0, -this.calculatedLeftPosition);
        const maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        rect.left = this.calculatedLeftPosition + maxAdjustment;
      }
    }
    return rect;
  }

  public get overlay(): { top: number, left: number, width: number, height: number } {
    const rect: any = { top: 0, left: 0, width: 0, height: 0 };
    if (this.selectedElementRect) {
      rect.top = this.selectedElementRect.top - this.highlightPadding;
      rect.left = this.selectedElementRect.left - this.highlightPadding;
      rect.height = this.selectedElementRect.height + (this.highlightPadding * 2);
      rect.width = this.selectedElementRect.width + (this.highlightPadding * 2);
    }
    return rect;
  }

  //
  //
  //
  private get highlightPadding(): number {
    let paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.defaultHighlightPadding : 0;
    if (this.currentTourStep.highlightPadding) {
      paddingAdjustment = this.currentTourStep.highlightPadding;
    }
    return paddingAdjustment;
  }

  // This calculates a value to add or subtract so the step should not be off screen.
  private getStepScreenAdjustment(): number {
    if (
      this.currentTourStep.orientation === Orientation.Left
      || this.currentTourStep.orientation === Orientation.Right
    ) {
      return 0;
    }

    const scrollAdjustment = this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0;
    const tourStepHeight = typeof this.tourStepRef.nativeElement.getBoundingClientRect === 'function' ? this.tourStepRef.nativeElement.getBoundingClientRect().height : 0;
    const elementHeight = this.selectedElementRect.height + scrollAdjustment + tourStepHeight;

    if ((this.windowRefService.nativeWindow.innerHeight - this.topOfPageAdjustment) < elementHeight) {
      return elementHeight - (this.windowRefService.nativeWindow.innerHeight - this.topOfPageAdjustment);
    }
    return 0;
  }

  private subscribeToScrollAndResize(): void {
    // listens to window resize events, so we can update the step location.
    // listens to window scroll events, so we can update the step location.
    this.resizeSubscription = fromEvent(this.windowRefService.nativeWindow, 'resize')
      .subscribe(() => { this.updateStepLocation(); });
    this.scrollSubscription = fromEvent(this.windowRefService.nativeWindow, 'scroll')
      .subscribe(() => { this.updateStepLocation(); });
  }

  private unsubscribeFromScrollAndResize(): void {
    this.resizeSubscription.unsubscribe();
    this.scrollSubscription.unsubscribe();
  }

  public ngAfterViewInit(): void {
    // when a new step is opened...
    this.guidedTourService.guidedTourCurrentStepStream
      .subscribe((step: GuidedTourStep) => {
        this.currentTourStep = step;
        if (step && step.selector) {
          // queries the element referenced, scrolls to it.
          // else just opens a default modal.
          const selectedElement = this.dom.querySelector(step.selector);
          if (selectedElement) {
            this.scrollToAndSetElement();
          } else {
            this.selectedElementRect = null;
          }
        } else {
          this.selectedElementRect = null;
        }
      });

    this.subscribeToScrollAndResize();
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromScrollAndResize();
  }
}
