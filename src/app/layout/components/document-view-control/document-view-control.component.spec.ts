import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewControlComponent } from './document-view-control.component';

describe('DocumentViewControlComponent', () => {
  let component: DocumentViewControlComponent;
  let fixture: ComponentFixture<DocumentViewControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentViewControlComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentViewControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
