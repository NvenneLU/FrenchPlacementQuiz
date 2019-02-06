import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editquestionp2Component } from './editquestionp2.component';

describe('Editquestionp2Component', () => {
  let component: Editquestionp2Component;
  let fixture: ComponentFixture<Editquestionp2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editquestionp2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editquestionp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
