import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewPageComponent } from './document-view-page.component';

describe('DocumentViewPageComponent', () => {
  let component: DocumentViewPageComponent;
  let fixture: ComponentFixture<DocumentViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentViewPageComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
