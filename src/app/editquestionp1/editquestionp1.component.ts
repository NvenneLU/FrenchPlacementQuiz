import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionService } from '../question.service'
import { QuestionP1 } from '../questions';

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-editquestionp1',
  templateUrl: './editquestionp1.component.html',
  styleUrls: ['./editquestionp1.component.css']
})
export class Editquestionp1Component implements OnInit {

  @Input() question: QuestionP1;
  @Output() complete = new EventEmitter<boolean>();

  p1Form: FormGroup;
  audioFile: FormControl;
  correct: FormControl;
  marks: FormControl;

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
    $(function() {
      M.updateTextFields();
    });
  }

  createFormControl() {
    this.audioFile = new FormControl(((this.question) ? this.question.audioFile : ''), Validators.required);
    this.correct = new FormControl(((this.question) ? this.question.correct : ''), Validators.required);
    this.marks = new FormControl(((this.question) ? this.question.marks : ''), Validators.required);
  }
  createForm() {
    this.p1Form = new FormGroup({
      audioFile: this.audioFile,
      correct: this.correct,
      marks: this.marks
    });
  }

  back() {
    this.complete.emit(true);
  }

  save() {
    if(this.question == null) {
      this.question = new QuestionP1;
      this.question.audioFile = this.audioFile.value;
      this.question.correct = this.correct.value;
      this.question.marks = this.marks.value;
      this.question.num = this.questionService.calTotalQuestions(1) + 1;
      this.questionService.addQuestion(this.question, 1);
    } else {
      this.question.audioFile = this.audioFile.value;
      this.question.correct = this.correct.value;
      this.question.marks = this.marks.value;
      this.questionService.updateQuestion(this.question, 1);
    }

    this.back();
  }

  delete() {
    this.questionService.deleteQuestion(this.question, 1);
    setTimeout(() => {this.back();}, 500);
  }



}
