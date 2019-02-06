import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { QuestionP4 } from '../questions';
import { Howl, Howler } from 'howler';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-questionp4',
  templateUrl: './questionp4.component.html',
  styleUrls: ['./questionp4.component.css'],
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
export class Questionp4Component implements OnInit, AfterViewInit, OnChanges {

  @Input() question: QuestionP4;
  @Output() nextQuestion = new EventEmitter<number>();
  @Output() beginTimer = new EventEmitter<boolean>();

  words: string[] = new Array();
  selected: string[] = new Array();
  selectLocation: number[] = new Array();
  openID: number;
  selectedID: number;
  selectCount: number;
  player: Howl;

  constructor() { }

  ngOnInit() {
    this.openID = 0;
    this.selectedID = 0;
    this.selectCount = 0;
    this.words = this.question.text.split(" ");

    for(let i = 0; i < this.words.length; i++) {
      this.selected[i] = "_______";
    }
    $(function() {
      $('.modal').modal({opacity: 0, startingTop: '80%', endingTop: '60%'});
    });

  }

  playAudio() {
    this.player.stop();
    this.player.play();
  }

  ngOnChanges() {
    this.openID = 0;
    this.selectedID = 0;
    this.selectCount = 0;
    this.words = this.question.text.split(" ");

    for(let i = 0; i < this.words.length; i++) {
      this.selected[i] = "_______";
    }

    $(function() {
      $('.modal').modal({opacity: 0, startingTop: '80%', endingTop: '60%'});
    });
    this.player = new Howl({
      src: ['/frenchFSL/assets/audio/P4/' + this.question.audioFile]
      // src: ['../../assets/audio/P4' + this.question.audioFile]
    });
    this.player.play();
    this.beginTimer.emit(true);

  }

  ngAfterViewInit() {

  }

  select(id: number) {
    this.openID = -1;
    this.selectedID = id;
    for(let i = 0; i < this.words.length; i++) {
      if(this.words[i] == '[]') {
        this.openID++;
        if(i == id) {
          return;
        }
      }
    }
  }

  change(index: number) {
    if(this.selected[this.selectedID] == '_______') {
      this.selectCount++;
    }
    this.selected[this.selectedID] = this.question.options[this.openID][index];
    this.selectLocation[this.openID] = this.selectedID;
  }

  next(): void {
    //Emit if the user got the correct question
    this.player.stop();
    let marks: number = 0;
    for(let i = 0; i < this.question.options.length; i++) {
      if((this.question.options[i].indexOf(this.selected[this.selectLocation[i]]) + 1) == this.question.correct[i]) {
        marks += parseInt(this.question.marks[i].toString());
      }
    }

    this.nextQuestion.emit(marks);
  }
}
