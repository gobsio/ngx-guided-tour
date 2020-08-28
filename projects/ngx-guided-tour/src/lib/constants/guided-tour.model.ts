import { GuidedTourStep } from './guided-tour-step.model';

export interface GuidedTour {

  /**
   * Identifier for tour
   */
  tourId: string;

  /**
   * @deprecated
   * Use orb to start tour
   */
  useOrb?: boolean;

  /**
   * Steps fo the tour
   */
  steps: GuidedTourStep[];

  /**
   * Prevents the tour from advancing by clicking the backdrop.
   * This should only be set if you are completely sure your tour
   * is displaying correctly on all screen sizes otherwise a user can get stuck.
   */
  preventBackdropFromAdvancing?: boolean;

  /**
   * Function will be called when tour is skipped
   */
  skipCallback?: (stepSkippedOn: number) => void;

  /**
   * Function will be called when tour is completed
   */
  completeCallback?: () => void;

  /**
   * @deprecated
   * Minimum size of screen in pixels before the tour is run,
   * if the tour is resized below this value the user
   *  will be told to resize
   */
  minimumScreenSize?: number;

  /**
   * @deprecated
   * Dialog shown if the window width is smaller
   * than the defined minimum screen size.
   */
  resizeDialog?: {
    title?: string;
    content: string;
  };

}
