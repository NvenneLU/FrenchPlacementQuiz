import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { Howl, Howler } from 'howler';
import { QuestionP1 } from '../questions';
import { Student } from '../student';
import { StudentsService } from '../students.service';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
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
export class QuestionComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() question: QuestionP1;
  @Output() nextQuestion = new EventEmitter<number>();
  @Output() beginTimer = new EventEmitter<boolean>();

  selected: number = 0;
  player: Howl;
  student: Student;
  encodedID: string;
  isMobile: any;

  constructor(private studentService: StudentsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selected = 0;
    this.encodedID = this.route.snapshot.paramMap.get('encodedID');
    this.student = this.studentService.getStudent(parseInt(atob(this.encodedID)));

  }

  ngOnChanges() {
    $(function() {
      $('.tooltipped').tooltip();
    });
    this.player = new Howl({
      src: ['/frenchFSL/assets/audio/P1/' + this.question.audioFile]
      // src: ['../../assets/audio/P1/' + this.question.audioFile]
    });
    this.isMobile = window.matchMedia("only screen and (max-width: 760px)");

    this.player.play();

    this.player.once('end', () => {this.beginTimer.emit(true);});
  }

  ngAfterViewInit() {

  }

  checked(q: number): void {
    if(this.selected != q)
      this.selected = q;
    else
      this.selected = 0;
  }

  next(): void {
    //Emit if the user got the correct question

    this.player.stop();
    this.nextQuestion.emit((this.selected == this.question.correct) ? parseInt(this.question.marks.toString()) : 0);
    this.selected = 0;
  }

}
