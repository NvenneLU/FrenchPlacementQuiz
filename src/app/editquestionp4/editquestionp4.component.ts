import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestionService } from '../question.service';
import { QuestionP4 } from '../questions';

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
  selector: 'app-editquestionp4',
  templateUrl: './editquestionp4.component.html',
  styleUrls: ['./editquestionp4.component.css']
})
export class Editquestionp4Component implements OnInit {

  @Input() question: QuestionP4;
  @Output() complete = new EventEmitter<boolean>();

  p4Form: FormGroup;
  text: FormControl;
  options: FormControl[][] = new Array();
  marks: FormControl[] = new Array();
  correct: FormControl[] = new Array();
  audioFile: FormControl;
  optionCount: FormControl;
  title: FormControl;

  constructor(private questionService: QuestionService) { }

  createFormControl() {

    this.optionCount = new FormControl(((this.question) ? this.question.options.length : 1), [Validators.required, Validators.min(1)]);
    this.text = new FormControl(((this.question) ? this.question.text : ''), Validators.required);
    this.audioFile = new FormControl(((this.question) ? this.question.audioFile : ''), Validators.required);
    this.title = new FormControl(((this.question) ? this.question.title : ''));

    for(let i = 0; i < this.optionCount.value ;i++) {
      this.correct[i] = new FormControl(((this.question) ? this.question.correct[i] : ''), [Validators.required, Validators.min(1), Validators.max(4)]);
      this.marks[i] = new FormControl(((this.question) ? this.question.marks[i] : ''), Validators.required);
      this.options[i] = new Array();
      for(let j = 0; j < 4; j++) {
        this.options[i][j] = new FormControl(((this.question) ? this.question.options[i][j] : ''), Validators.required);
      }
    }
  }

  createForm() {
    this.p4Form = new FormGroup({
      text: this.text,
      audioFile: this.audioFile,
      optionCount: this.optionCount,
      title: this.title
    });

    for(let i = 0; i < this.optionCount.value; i++) {
      this.p4Form.addControl('correct' + i, this.correct[i]);
      this.p4Form.addControl('marks' + i, this.marks[i]);
      for(let j = 0; j < 4; j++) {
        this.p4Form.addControl('option' + i + '' + j, this.options[i][j]);
      }
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

  updateOptions() {
    if(this.options.length > this.optionCount.value) {
      this.options.pop();
      this.correct.pop();
      this.marks.pop();
      for(let i = 0; i < 4; i++) {
        this.p4Form.removeControl('option' + this.optionCount.value + '' + i);
      }
      this.p4Form.removeControl('correct' + this.optionCount.value);
      this.p4Form.removeControl('marks' + this.optionCount.value);
    } else {
      let temp: FormControl[] = new Array(4);
      let temp2: FormControl = new FormControl('', Validators.required);
      let temp3: FormControl = new FormControl('', Validators.required);

      for(let i = 0; i < 4; i++) {
        temp[i] = new FormControl('', Validators.required);
        this.p4Form.addControl('option' + (this.options.length) + '' + i, temp[i]);
        this.p4Form.updateValueAndValidity();
      }
      this.p4Form.addControl('marks' + (this.options.length), temp3);
      this.p4Form.addControl('correct' + (this.options.length), temp2);
      this.p4Form.updateValueAndValidity();
      this.options.push(temp);
      this.correct.push(temp2);
      this.marks.push(temp3);
    }

  }

  onSubmit() {
    if(this.p4Form.valid) {
      this.save();
    }
  }

  save() {
    if(this.question == null) {
      this.question = new QuestionP4;
      this.question.correct = new Array();
      this.question.marks = new Array();
      this.question.options = new Array();
      this.question.audioFile = this.audioFile.value;
      this.question.text = this.text.value;
      this.question.num = this.questionService.calTotalQuestions(4) + 1;
      this.question.title = this.title.value;
      for(let i = 0; i < this.optionCount.value; i++) {
        this.question.correct[i] = this.correct[i].value;
        this.question.marks[i] = this.marks[i].value;
        this.question.options[i] = new Array();
        for(let j = 0; j < 4; j++) {
          this.question.options[i][j] = this.options[i][j].value;
        }
      }
      this.questionService.addQuestion(this.question, 4);
    } else {
      this.question.text = this.text.value;
      this.question.audioFile = this.audioFile.value;
      this.question.title = this.title.value;
      for(let i = 0; i < this.optionCount.value; i++) {
        this.question.correct[i] = this.correct[i].value;
        this.question.marks[i] = this.marks[i].value;
        if(!this.question.options[i]) {
          this.question.options[i] = new Array();
        }
        for(let j = 0; j < 4; j++) {
          this.question.options[i][j] = this.options[i][j].value;
        }
      }
      this.questionService.updateQuestion(this.question, 4);
    }
    this.back();
  }

  delete() {
    this.questionService.deleteQuestion(this.question, 4);
    setTimeout(() => {this.back();}, 500);
  }

}
