import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Questionp3Component } from './questionp3.component';

describe('Questionp3Component', () => {
  let component: Questionp3Component;
  let fixture: ComponentFixture<Questionp3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Questionp3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Questionp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
