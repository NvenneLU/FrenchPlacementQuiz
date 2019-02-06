import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { StudentsService } from '../students.service';
import { QuestionService } from '../question.service';
import { TestconfigService } from '../testconfig.service';
import { Student } from '../student';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  @Input() student: Student;
  @Output() complete = new EventEmitter<boolean>();

  studentForm: FormGroup;
  name: FormControl;
  studentID: FormControl;
  email: FormControl;
  part: FormControl;
  question: FormControl;
  marks: FormControl;
  class: FormControl;
  timeLeft: FormControl;
  isFinished: FormControl;
  selectedID: number;

  questions: any[][];
  config: any;

  constructor(private questionService: QuestionService, private studentService: StudentsService, private testService: TestconfigService) { }

  ngOnInit() {
    this.questions = this.questionService.getQuestions();
    this.createFormControl();
    this.createForm();
    $(function() {
      $('select').formSelect();
      M.updateTextFields();
    });
    this.config = this.testService.getConfig();
    console.log(this.config);

  }

  updateSelect() {
    this.selectedID = this.part.value - 1;
    this.question.setValue(1);
    $(function() {
      $('select').formSelect();


    })

  }

  createFormControl() {
    this.name = new FormControl(this.student.name, Validators.required);
    this.studentID = new FormControl(this.student.studentID, Validators.required);
    this.email = new FormControl(this.student.email, Validators.required);
    this.selectedID = this.questionService.getSection(this.student.progress) - 1;
    this.part = new FormControl(this.questionService.getSection(this.student.progress), Validators.required);
    this.question = new FormControl(this.questionService.getQuestion(this.student.progress), Validators.required);
    this.marks = new FormControl(this.student.marks, Validators.required);
    this.class = new FormControl(this.student.class);
    this.timeLeft = new FormControl(Math.round(this.student.timeLeft / 60000), Validators.required);
    this.isFinished = new FormControl((this.student.progress > this.questionService.calTotalQuestions(5) || this.student.timeLeft <= 0 ? 1 : 0));
  }

  createForm() {
    this.studentForm = new FormGroup({
      name: this.name,
      studentID: this.studentID,
      email: this.email,
      part: this.part,
      question: this.question,
      marks: this.marks,
      class: this.class,
      timeLeft: this.timeLeft,
      isFinished: this.isFinished
    });
  }

  updateClass() {
    console.log(this.isFinished.value);
    if(this.timeLeft.value == 0) {
      this.isFinished.setValue(true);
      this.isFinished.disable();
    } else {
      this.isFinished.enable();
    }
    if(this.isFinished.value == true) {
      if(this.marks.value > this.config.medianMark[2]) {
        this.class.setValue('2506');
      } else if (this.marks.value > this.config.medianMark[1] && this.marks.value <= this.config.medianMark[2]) {
        this.class.setValue('1505');
      } else if (this.marks.value > this.config.medianMark[0] && this.marks.value <= this.config.medianMark[1]) {
        this.class.setValue('1060');
      } else {
        this.class.setValue('1050');
      }
    } else {
      this.class.setValue('');
    }
    M.updateTextFields();
  }


  save() {
    this.student.name = this.name.value;
    this.student.studentID = this.studentID.value;
    this.student.email = this.email.value;
    this.student.marks = this.marks.value;
    this.student.class = this.class.value;
    if(this.isFinished.value == true) {
      this.student.progress = this.questionService.calTotalQuestions(5) + 1;
    } else {
      this.student.progress = this.questionService.calProgress(this.part.value, this.question.value);
      console.log(this.student.progress);
    }

    this.student.timeLeft = this.timeLeft.value * 60000;
    this.student.adminMod = 1;
    this.studentService.updateStudentAdmin(this.student);
    setTimeout(() => {this.back();}, 500);
  }

  back() {
    this.complete.emit(true);
  }

  delete() {
    this.studentService.deleteStudent(this.student);
    setTimeout(() => {this.back();}, 500);
  }
}
