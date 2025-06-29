import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageViewComponent } from './document-page-view.component';

describe('DocumentPageViewComponent', () => {
  let component: DocumentPageViewComponent;
  let fixture: ComponentFixture<DocumentPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPageViewComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
