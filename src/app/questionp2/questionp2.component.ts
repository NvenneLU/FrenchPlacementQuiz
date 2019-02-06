import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Howl, Howler } from 'howler';
import { QuestionP2 } from '../questions';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-questionp2',
  templateUrl: './questionp2.component.html',
  styleUrls: ['./questionp2.component.css'],
  animations: [
    trigger('fadeIn', [
      state('in', style({transform: 'translateY(0)', opacity: 1})),
      transition('void => *', [
        style({transform: 'translateY(-30%)', opacity: 0}),
        animate(300)
      ])
    ])
  ]
})
export class Questionp2Component implements OnInit, OnChanges {

  @Input() set finished(finished: boolean) {
    //(finished);
    this.finish = finished;
  }

  @Input() question: QuestionP2;

  @Output() nextQuestion = new EventEmitter<number>();
  @Output() beginTimer = new EventEmitter<boolean>();

  selected: number[] = new Array();
  player: Howl;
  preTimer: number = 60;
  interval: any;
  finish: boolean;

  constructor() { }

  ngOnInit() {
    this.reset();
    this.finish = false;
  }

  ngOnChanges() {
    //("changed");
    if(this.finish) {
      clearInterval(this.interval);
      this.player.stop();
      //("stopped");
      this.nextQuestion.emit(-1);
      return;
    }
    this.preTimer = 30;
    $(function() {
      $('.tooltipped').tooltip();
    });
    this.player = new Howl({
      src: ['/frenchFSL/assets/audio/P2/' + this.question.audioFile]
      // src: ['../../assets/audio/P2/' + this.question.audioFile]
    });
    M.toast({html: 'Text will start in 30 seconds.'});
    this.interval = setInterval(() => {this.counter();}, 1000);
    this.player.once('end', () => {this.beginTimer.emit(true);});
  }

  checked(n: number, m: number) {
    if(this.selected[n] != m)
      this.selected[n] = m;
    else
      this.selected[n] = 0;
  }

  counter() {
    if(this.finished) {
      clearInterval(this.interval);
      this.player.stop();
      //("stopped");
    }
    this.preTimer--;
    if(this.preTimer == 10)
      M.toast({html: '10 seconds'});
    if(this.preTimer <= 0) {
      clearInterval(this.interval);
      this.player.play();
    }
  }


  next(): void {
    //Emit if the user got the correct question
    clearInterval(this.interval);
    this.player.stop();
    let marks: number = 0;
    for(let i = 0; i < this.selected.length; i++) {
      if(this.selected[i] == this.question.correct[i]) {
        marks += parseInt(this.question.marks[i].toString());
      }
    }

    this.nextQuestion.emit(marks);
    this.reset();
  }

  reset() {
    this.selected[0] = 0;
    this.selected[1] = 0;
    this.selected[2] = 0;
    this.selected[3] = 0;
  }

}
