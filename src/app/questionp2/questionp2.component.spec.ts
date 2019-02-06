import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Questionp2Component } from './questionp2.component';

describe('Questionp2Component', () => {
  let component: Questionp2Component;
  let fixture: ComponentFixture<Questionp2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Questionp2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Questionp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
