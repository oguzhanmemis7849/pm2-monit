import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm2ListComponent } from './pm2-list.component';

describe('TutorialsListComponent', () => {
  let component: Pm2ListComponent;
  let fixture: ComponentFixture<Pm2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Pm2ListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pm2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
