import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editquestionp4Component } from './editquestionp4.component';

describe('Editquestionp4Component', () => {
  let component: Editquestionp4Component;
  let fixture: ComponentFixture<Editquestionp4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editquestionp4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editquestionp4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
