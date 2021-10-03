import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsAttachmentFormComponent } from './audits-attachment-form.component';

describe('AuditsAttachmentFormComponent', () => {
  let component: AuditsAttachmentFormComponent;
  let fixture: ComponentFixture<AuditsAttachmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditsAttachmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditsAttachmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
