import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessSongContainerComponent } from './guess-song-container.component';

describe('GuessSongContainerComponent', () => {
  let component: GuessSongContainerComponent;
  let fixture: ComponentFixture<GuessSongContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessSongContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessSongContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
