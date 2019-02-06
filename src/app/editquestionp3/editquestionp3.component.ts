import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionService } from '../question.service';
import { QuestionP3 } from '../questions';

declare var M: any;
declare var $: any;

function validateOption(input: FormControl) {
  if(!input.root || !input.parent) {
    return null;
  }

  let option = input.value;
  let words = input.parent.controls['text'].value.split(" ");
  if(!words.some(word => word === option)) {
    return {
      validateOption: true
    }
  }
  return null;
}

@Component({
  selector: 'app-editquestionp3',
  templateUrl: './editquestionp3.component.html',
  styleUrls: ['./editquestionp3.component.css']
})
export class Editquestionp3Component implements OnInit {

  @Input() question: QuestionP3;
  @Output() complete = new EventEmitter<boolean>();

  p3Form: FormGroup;
  text: FormControl;
  options: FormControl[] = new Array();
  marks: FormControl;
  audioFile: FormControl;
  correct: FormControl;

  constructor(private questionService: QuestionService) { }

  createFormControl() {

    this.text = new FormControl(((this.question) ? this.question.text : ''), Validators.required);
    this.marks = new FormControl(((this.question) ? this.question.marks : ''), Validators.required);
    this.audioFile = new FormControl(((this.question) ? this.question.audioFile : ''), Validators.required);
    this.correct = new FormControl(((this.question) ? this.question.correct : ''), Validators.required);
    for(let i = 0; i < 4;i++) {
      this.options[i] = new FormControl(((this.question) ? this.question.options[i] : ''), validateOption);
    }
  }

  createForm() {
    this.p3Form = new FormGroup({
      text: this.text,
      marks: this.marks,
      audioFile: this.audioFile,
      correct: this.correct
    });

    for(let i = 0; i < 4; i++) {
      this.p3Form.addControl('option' + i, this.options[i]);
    }
  }

  ngOnInit() {
    this.createFormControl();
    this.createForm();

    $(function() {
      M.updateTextFields();
      M.textareaAutoResize($('#textarea1'));
    });
  }


  back() {
    this.complete.emit(true);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.updateValueAndValidity({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    formGroup.updateValueAndValidity({ onlySelf: true });
  }

  onSubmit() {
    this.validateAllFormFields(this.p3Form);
    if(this.p3Form.valid) {
      this.save();
    }
  }

  save() {
    if(this.question == null) {
      this.question = new QuestionP3;
      this.question.options = new Array();
      this.question.text = this.text.value;
      this.question.marks = this.marks.value;
      this.question.correct = this.correct.value;
      this.question.audioFile = this.audioFile.value;
      this.question.num = this.questionService.calTotalQuestions(3) + 1;
      for(let i = 0; i < this.options.length; i++) {
        this.question.options[i] = this.options[i].value;
      }
      this.questionService.addQuestion(this.question, 3);
    } else {
      this.question.text = this.text.value;
      this.question.marks = this.marks.value;
      this.question.correct = this.correct.value;
      this.question.audioFile = this.audioFile.value;
      for(let i = 0; i < this.options.length; i++) {
        this.question.options[i] = this.options[i].value;
      }
      this.questionService.updateQuestion(this.question, 3);
    }
    this.back();
  }

  delete() {
    this.questionService.deleteQuestion(this.question, 3);
    setTimeout(() => {this.back();}, 500);
  }

}
