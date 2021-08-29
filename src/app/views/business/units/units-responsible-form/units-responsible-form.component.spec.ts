import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { unitsResponsibleFormComponent } from './units-responsible-form.component';

describe('unitsResponsibleFormComponent', () => {
  let component: unitsResponsibleFormComponent;
  let fixture: ComponentFixture<unitsResponsibleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ unitsResponsibleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(unitsResponsibleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
