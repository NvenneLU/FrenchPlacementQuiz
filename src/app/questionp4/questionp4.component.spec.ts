import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Questionp4Component } from './questionp4.component';

describe('Questionp4Component', () => {
  let component: Questionp4Component;
  let fixture: ComponentFixture<Questionp4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Questionp4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Questionp4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
