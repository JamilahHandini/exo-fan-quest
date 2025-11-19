import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallingStarsComponent } from './falling-stars.component';

describe('FallingStarsComponent', () => {
  let component: FallingStarsComponent;
  let fixture: ComponentFixture<FallingStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallingStarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FallingStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
