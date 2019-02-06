import { Component, OnInit, AfterViewInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)', opacity: 1})),
      transition('void => *', [
        style({transform: 'translateY(-100%)', opacity: 0.5}),
        animate('0.5s ease-in')
      ])
    ])
  ]

})
export class NavbarComponent implements OnInit, AfterViewInit, OnChanges {

  title = 'French Placement Test';
  @Input() progress: number;
  @Input() timer: number;
  @Input() questionTimer: number;
  @Output() triggerAnim = new EventEmitter<boolean>();

  minutes: number;
  seconds: number;
  time: number;




  constructor() { }

  ngOnChanges() {
    this.minutes = Math.floor(this.timer / 60);
    this.seconds = Math.floor(this.timer % 60);
    this.time = Math.floor(this.questionTimer);
  }

  finishAnim() {
    this.triggerAnim.emit(true);
  }

  ngOnInit() {

  }

  getColor() {
    if(this.time <= 5) {
      return 'red pulse';
    } else if(this.time <= 10) {
      return 'red';
    } else if(this.time <= 30) {
      return 'orange';
    }
  }

  ngAfterViewInit() {

  }

}
