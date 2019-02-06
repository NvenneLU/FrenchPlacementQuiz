import { Component, OnInit } from '@angular/core';
import { QuestionP1, QuestionP2, QuestionP3, QuestionP4 } from '../questions'
import { QuestionService } from '../question.service'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student';
import { StudentsService } from '../students.service';
import { Howl, Howler } from 'howler';
import { TestConfig } from '../TestConfig';
import { TestconfigService } from '../testconfig.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)', opacity: 1, })),
      transition('void => *', [
        animate('0.5s', keyframes([
          style({transform: 'translateX(100%) scale(0.9)', opacity: 0, offset: 0.0}),
          style({transform: 'translateX(0) scale(0.9)', opacity: 1, offset: 0.6}),
          style({transform: 'translateX(0) scale(0.9)', opacity: 1, offset: 0.8}),
          style({transform: 'translateX(0) scale(1)', opacity: 1, offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate('0.5s 0.3s', keyframes([
          style({transform: 'scale(0.9)', offset: 0.2}),
          style({transform: 'scale(0.9)', offset: 0.4}),
          style({transform: 'translateX(-80%) scale(0.9)', opacity: 0.2, offset: 0.6}),
          style({transform: 'translateX(-180%) scale(0.9)', opacity: 0, offset: 1.0})
        ]))
      ])
    ]),
    trigger('flyUp', [
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
export class QuizComponent implements OnInit {


  questions: any[][];

  config: TestConfig;

  //Keep track of which section student is on
  section: number;
  //Keep track of total student progress
  progress: number;
  //Keep track of which question student is on in specific section.
  questionCounter: number;

  targetTime: number;
  secondsLeft: number;
  clockInterval: any;

  toggleState: boolean = false;

  timer: number;
  timerTime: number;
  timerInterval: any;

  encodedID: string;
  student: Student;

  player: Howl;

  ready: boolean = false;
  interlude: number = 0;

  currentQuestion: any;
  currentSection: any[];
  totalQuestions: number;

  finished: boolean = false;
  isFinishing: boolean = false;


  constructor(private testService: TestconfigService, private questionService: QuestionService, private route: ActivatedRoute, private router: Router, private studentService: StudentsService) { }

  ngOnInit() {
    //Init variables
    this.section = 1;
    this.progress = 15;
    this.questionCounter = 1;

    this.encodedID = this.route.snapshot.paramMap.get('encodedID');




    try {
      this.config = this.testService.getConfig();
      this.questions = this.questionService.getQuestions();
      this.student = this.studentService.getStudent(parseInt(atob(this.encodedID)));

      this.totalQuestions = this.questionService.calTotalQuestions(5);
      //(this.student.progress);

      if(this.student.timeLeft == 0) {
        this.finished = true;
        return;
      }
      if(!this.student.marks) {
        this.student.marks = 0;
      }
      if(this.student.progress > this.totalQuestions) {
        this.finished = true;
        return;
      } else if(this.student.progress > 0) {

        if(this.student.adminMod == 0) {
          this.section = this.questionService.getSection(this.student.progress);
          this.questionCounter = this.questionService.getQuestion(this.student.progress) + 1;

          this.student.progress = this.questionService.calProgress(this.section, this.questionCounter);

        }
        //(this.totalQuestions);
        //(this.student.progress);
        if(this.student.progress > this.totalQuestions) {
          this.studentService.updateStudent(this.student);
          this.done();
          return;
        }

        this.section = this.questionService.getSection(this.student.progress);
        this.questionCounter = this.questionService.getQuestion(this.student.progress);

        this.progress = this.questionService.getProgressPercent(this.student.progress);

        this.targetTime = new Date().getTime() + parseInt(this.student.timeLeft.toString());
        this.student.progress = this.questionService.calProgress(this.section, this.questionCounter);
        this.studentService.updateStudent(this.student);
      } else {
        this.student.progress = 1;
        this.progress = this.questionService.getProgressPercent(this.student.progress);
        this.student.timeLeft = this.config.quizTime * 1000;
        this.studentService.updateStudent(this.student);
        this.targetTime = new Date().getTime() + (1000 * this.config.quizTime);
      }

      if(!this.finished) {
        this.countdown();
        this.clockInterval = setInterval(() => {this.countdown();}, 1000);
        this.interludeF(this.section);

        this.currentSection = this.questions[this.section - 1];
        this.currentQuestion = this.questions[this.section - 1][this.questionCounter - 1];
        this.timer = this.config.questionTime[this.section - 1];
        this.ready = true;
      }

    } catch(e) {
      if(this.player)
        this.player.stop();
      this.router.navigate(['/intro']);

    }

  }

  startTimer(run: boolean) {
    this.timerTime = new Date().getTime() + (1000 * this.config.questionTime[this.section - 1]);
    this.countdownTimer();
    this.timerInterval = setInterval(() => {this.countdownTimer();}, 1000);
  }

  countdownTimer() {
    let currentTime = new Date().getTime();
    this.timer = (this.timerTime - currentTime) / 1000;
    if(this.timerTime <= currentTime) {
      this.nextQuestion(0);
      clearInterval(this.timerInterval);
      return;
    }
  }

  countdown() {
    if(this.student.timeLeft <= 0) {
      this.secondsLeft = 0;
      this.done();
      return;
    }
    let currentTime = new Date().getTime();
    this.secondsLeft = (this.targetTime - currentTime) / 1000;
    this.student.timeLeft = this.secondsLeft * 1000;
    this.studentService.updateStudentTime(this.student);
    if(this.targetTime <= currentTime) {
      this.secondsLeft = 0;
      this.done();
      return;
    }
  }

  nextQuestion(marks: number) {

    if(marks == -1) {
      this.toggleState = false;

      return;
    }

    this.toggleState = false;

    if(typeof this.student.marks == 'string')
      this.student.marks = parseInt(this.student.marks);
    this.student.marks += marks;

    if(this.student.progress == this.totalQuestions) {
      this.done();
      return;
    }

    if(this.questionCounter == this.currentSection.length) {
      this.nextSection();
      return;
    }

    this.questionCounter++;
    this.student.progress = this.questionService.calProgress(this.section, this.questionCounter);
    this.progress = this.questionService.getProgressPercent(this.student.progress);


    clearInterval(this.timerInterval);
    this.timer = this.config.questionTime[this.section - 1];

    this.studentService.updateStudent(this.student);

    //Else move on to the next question.
    this.currentQuestion = this.currentSection[this.questionCounter - 1];
  }

  resetState() {
    //('I ran3');

    if(this.isFinishing) {
      //('I ran2');
      this.finished = true;
      $(function() {
        $('.dropdown-trigger').dropdown({constrainWidth: false});
        $('.modal').modal();
      });
      return;
    }
    this.toggleState = true;
  }

  dropdown() {
    $(function() {
      $('.dropdown-trigger').dropdown({constrainWidth: false});
      $('.modal').modal();
    });

  }

  nextSection() {
    //Go to next section
    this.section++;
    //Set the current Section to the next section
    this.currentSection = this.questions[this.section - 1];
    //Reset the question counter
    this.questionCounter = 1;
    //Set the current question to the first section question.
    this.currentQuestion = this.currentSection[this.questionCounter - 1];

    this.student.progress = this.questionService.calProgress(this.section, this.questionCounter);

    this.progress = this.questionService.getProgressPercent(this.student.progress);

    this.studentService.updateStudent(this.student);

    this.timer = this.config.questionTime[this.section - 1];
    this.interludeF(this.section);
  }

  done() {
    //("i ran");
    if(this.student.marks > this.config.medianMark[2]) {
      this.student.class = '2506';
    } else if (this.student.marks > this.config.medianMark[1] && this.student.marks <= this.config.medianMark[2]) {
      this.student.class = '1505';
    } else if (this.student.marks > this.config.medianMark[0] && this.student.marks <= this.config.medianMark[1]) {
      this.student.class = '1060';
    } else {
      this.student.class = '1050';
    }


    this.student.completeTime = new Date().toJSON();
    //(this.student.completeTime);

    clearInterval(this.clockInterval);

    this.student.progress = this.student.progress + 1;
    if(this.student.progress > 56)
      this.student.progress = 56;

    this.studentService.updateStudent(this.student);


    this.isFinishing = true;
    $(function() {
      $('.dropdown-trigger').dropdown({constrainWidth: false});
      $('.modal').modal();
    });

  }

  interludeF(interl?: number) {
    //("Interlude");
    if(interl) {
      this.interlude = interl;
    } else {
      this.interlude = 0;
      this.toggleState = false;
      this.player.stop();
      return;
    }

    this.player = new Howl({
      src: ['/frenchFSL/assets/audio/P' + this.interlude + '/Intro.mp3']
      // src: ['../../assets/audio/P' + this.interlude + '/Intro.mp3']
    });
    this.player.play();

  }

}
