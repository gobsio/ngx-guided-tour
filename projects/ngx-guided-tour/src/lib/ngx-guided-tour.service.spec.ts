import { TestBed } from '@angular/core/testing';

import { NgxGuidedTourService } from './ngx-guided-tour.service';

describe('NgxGuidedTourService', () => {
  let service: NgxGuidedTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxGuidedTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
