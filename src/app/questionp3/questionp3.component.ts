import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { QuestionP3 } from '../questions';
import { Howl, Howler } from 'howler';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'app-questionp3',
  templateUrl: './questionp3.component.html',
  styleUrls: ['./questionp3.component.css'],
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
export class Questionp3Component implements OnInit {

  @Input() question: QuestionP3;
  @Output() nextQuestion = new EventEmitter<number>();
  @Output() beginTimer = new EventEmitter<boolean>();

  selected: number;
  words: string[] = new Array();
  player: Howl;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.selected = 0;
    this.compileQuestion();
    console.log(this.question.audioFile);
    this.player = new Howl({
      src: ['/frenchFSL/assets/audio/P3/' + this.question.audioFile]
      // src: ['../../assets/audio.P3' + this.question.audioFile]
    });
    this.player.play();
    this.beginTimer.emit(true);

  }

  playAudio() {
    this.player.stop();
    this.player.play();
  }

  compileQuestion() {
    let w: string[] = this.question.text.split(" ");
    let index;
    let count: number = 0;
    let temp = this.words;
    this.question.options.forEach(function(option) {
      index = w.indexOf(option);
      if(index > -1) {
        let phrase: string[];
        phrase = w.splice(0, index + 1 );
        let tmp = phrase.slice(0,-1).join(" ");
        temp[count] = tmp;
        count++;
      }
    });
    this.words[4] = w.join(" ");
    this.words = temp;
  }

  getSelected(index: number) {
    if(this.selected == index) {
      return 'red-text';
    } else {
      return 'blue-text';
    }
  }

  select(index: number) {
    if(this.selected == index) {
      this.selected = 0;
    } else {
      this.selected = index;
    }

  }

  next(): void {
    //Emit if the user got the correct question
    this.player.stop();
    this.nextQuestion.emit((this.selected == this.question.correct) ? parseInt(this.question.marks.toString()) : 0);
  }



}
