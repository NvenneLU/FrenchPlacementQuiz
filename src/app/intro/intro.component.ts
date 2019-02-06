import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';
import { StudentsService } from '../students.service';
import { TestconfigService } from '../testconfig.service';

declare var $:any;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('0.5s 100ms ease-out', keyframes([
          style({transform: 'translateY(100%)', opacity: 0, offset: 0.0}),
          style({transform: 'translateY(0%)', opacity: 1, offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate('0.5s 300ms', keyframes([
          style({transform: 'translateY(10%)', offset: 0.4}),
          style({transform: 'translateY(10%)', offset: 0.6}),
          style({transform: 'translateY(-100%)', opacity: 0, offset: 1.0})

        ]))
      ])
    ])
  ]
})
export class IntroComponent implements OnInit, AfterViewInit {


  @Output() start = new EventEmitter<boolean>();

  signup: boolean = false;
  toggleState: boolean = true;
  inputPass: string;

  constructor(private questionService: QuestionService, private studentService: StudentsService, private testService: TestconfigService, private router: Router) { }

  ngOnInit() {
    this.questionService.initQuestions();
    this.studentService.initStudents();
    this.testService.initConfig();
  }

  ngAfterViewInit() {
    $(function() {
      $('.dropdown-trigger').dropdown({constrainWidth: false});
      $('.modal').modal();
    });
  }

  startQuiz(): void {
    if(this.toggleState == false)
      this.router.navigate(['/signup']);
  }

  signUp(): void {
    this.signup = !this.signup;
  }

  validatePass() {
    let pass = this.testService.getConfig().test;
    if(this.inputPass == pass) {
      this.router.navigate(['/admin']);

    }
  }





}
