import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editquestionp1Component } from './editquestionp1.component';

describe('Editquestionp1Component', () => {
  let component: Editquestionp1Component;
  let fixture: ComponentFixture<Editquestionp1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editquestionp1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editquestionp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
