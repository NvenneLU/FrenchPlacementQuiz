import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Student } from '../student';
import { StudentsService } from '../students.service';
import { QuestionService } from '../question.service';
import { TestconfigService } from '../testconfig.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

declare var $: any;



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
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
export class SignupComponent implements OnInit, AfterViewInit {

  studentID: string;
  password: string;
  error: string = "";
  toggleState: boolean = true;
  encoded: string;
  loading: boolean = false;

  constructor(private testService: TestconfigService, private studentService: StudentsService, private questionService: QuestionService, private router: Router) { }

  ngOnInit() {
    this.questionService.initQuestions();
    this.studentService.initStudents();
    this.testService.initConfig();
    $(function() {
      $('.dropdown-trigger').dropdown({constrainWidth: false});

    });
  }

  animFinished() {
    if(this.toggleState == false)
      this.router.navigate(['/quiz/' + this.encoded]);
  }

  onSubmit() {
    this.loading = true;
    // let student: Student = new Student();
    // student.name = this.name;
    // student.email = this.email;
    // student.studentID = this.studentnumber;
    //
    // this.studentService.newStudent(student, (error: string, success: boolean) : void => {
    //
    //   if(success) {
    //     this.toggleState = false;
    //     this.encoded = btoa(student.studentID.toString());
    //
    //   } else {
    //     this.error = error;
    //   }
    //
    // });

    this.studentService.loginStudent(this.studentID, this.password, (error: string, success: boolean, student: Student) => {
      if(success) {
        this.studentService.newStudent(student, (error: string, success: boolean) : void => {
          if(success) {
            this.toggleState = false;
            this.encoded = btoa(student.studentID.toString());

          } else {
            this.error = error;
          }
        });
      } else {
        this.error = error;
      }
      this.loading = false;
    });

  }

  ngAfterViewInit() {

  }

}
