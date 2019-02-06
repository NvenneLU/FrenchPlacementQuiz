import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionService } from '../question.service';
import { QuestionP2 } from '../questions';

declare var M: any;
declare var $: any;



@Component({
  selector: 'app-editquestionp2',
  templateUrl: './editquestionp2.component.html',
  styleUrls: ['./editquestionp2.component.css']
})
export class Editquestionp2Component implements OnInit {

  @Input() question: QuestionP2;
  @Output() complete = new EventEmitter<boolean>();
  audioIN: string;
  statementsIN: string[][] = new Array();
  statementsAnsIN: string[][] = new Array();
  correctIN: number[];
  marksIN: number;

  p2Form: FormGroup;
  statementsAns: FormControl[][] = new Array();
  statements: FormControl[] = new Array();
  audioFile: FormControl;
  marks: FormControl[] = new Array();
  correct: FormControl[] = new Array();

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();


    $(function() {
      M.updateTextFields();
    });
  }

  createFormControl() {
    for(let i = 0; i < 4; i++) {
      this.statements[i] = new FormControl(((this.question) ? this.question.statements[i] : ''), Validators.required);
      this.correct[i] = new FormControl(((this.question) ? this.question.correct[i] : ''), Validators.required);
      this.marks[i] = new FormControl(((this.question) ? this.question.marks[i] : ''), Validators.required);
      this.statementsAns[i] = new Array();
      for(let j = 0; j < 4; j++) {
        this.statementsAns[i][j] = new FormControl(((this.question) ? this.question.statementAnswers[i][j] : ''), Validators.required);
      }
    }

    this.audioFile = new FormControl(((this.question) ? this.question.audioFile : ''), Validators.required);

  }

  createForm() {
    this.p2Form = new FormGroup({
      audioFile: this.audioFile,
    });

    for(let i = 0; i < 4; i++) {
      this.p2Form.addControl('statement' + i, this.statements[i]);
      this.p2Form.addControl('correct' + i, this.correct[i]);
      this.p2Form.addControl('marks' + i, this.marks[i]);
      for(let j = 0; j < 4; j++) {
        this.p2Form.addControl('statementAns' + i + '' + j, this.statementsAns[i][j]);
      }
    }
  }

  back() {
    this.complete.emit(true);
  }

  save() {
    if(this.question == null) {
      this.question = new QuestionP2;
      this.question.audioFile = this.audioFile.value;
      this.question.correct = new Array();
      this.question.statements = new Array();
      this.question.statementAnswers = new Array();
      this.question.marks = new Array();
      for(let i = 0; i < 4; i++) {
        this.question.statements[i] = this.statements[i].value;
        this.question.correct[i] = this.correct[i].value;
        this.question.marks[i] = this.marks[i].value;
        this.question.statementAnswers[i] = new Array();
        for(let j = 0; j < 4; j++) {
          this.question.statementAnswers[i][j] = this.statementsAns[i][j].value;
        }
      }
      this.question.num = this.questionService.calTotalQuestions(2) + 1;
      console.log(this.question);
      this.questionService.addQuestion(this.question, 2);
    } else {
      this.question.audioFile = this.audioFile.value;
      for(let i = 0; i < 4; i++) {
        this.question.statements[i] = this.statements[i].value;
        this.question.correct[i] = this.correct[i].value;
        this.question.marks[i] = this.marks[i].value;
        for(let j = 0; j < 4; j++) {
          this.question.statementAnswers[i][j] = this.statementsAns[i][j].value;
        }
      }
      console.log(this.question);
      this.questionService.updateQuestion(this.question, 2);
    }
    this.back();
  }

  delete() {
    this.questionService.deleteQuestion(this.question, 2);
    setTimeout(() => {this.back();}, 500);
  }

}
