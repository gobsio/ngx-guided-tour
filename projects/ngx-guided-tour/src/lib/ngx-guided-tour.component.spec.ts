import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGuidedTourComponent } from './ngx-guided-tour.component';

describe('NgxGuidedTourComponent', () => {
  let component: NgxGuidedTourComponent;
  let fixture: ComponentFixture<NgxGuidedTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxGuidedTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGuidedTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
