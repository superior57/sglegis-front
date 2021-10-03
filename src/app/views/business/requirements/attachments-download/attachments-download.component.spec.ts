import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsDownloadComponent } from './attachments-download.component';

describe('AttachmentsDownloadComponent', () => {
  let component: AttachmentsDownloadComponent;
  let fixture: ComponentFixture<AttachmentsDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
