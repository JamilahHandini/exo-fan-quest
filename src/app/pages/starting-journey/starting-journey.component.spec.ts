import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingJourneyComponent } from './starting-journey.component';

describe('StartingJourneyComponent', () => {
  let component: StartingJourneyComponent;
  let fixture: ComponentFixture<StartingJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartingJourneyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartingJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
