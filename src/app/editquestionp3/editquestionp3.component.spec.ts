import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Editquestionp3Component } from './editquestionp3.component';

describe('Editquestionp3Component', () => {
  let component: Editquestionp3Component;
  let fixture: ComponentFixture<Editquestionp3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Editquestionp3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Editquestionp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
