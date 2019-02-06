import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class QuestionService {

  questions: any[][];

  questionUrl: string = '/frenchFSL/requestQuestions.php/';
  // questionUrl: string = 'https://www3.laurentian.ca/angular/french-test/src/requestQuestions.php';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    })
  }

  constructor(private http: HttpClient) { }
  /*
  getQuestions(): Observable<any[][]> {
    return of(QUESTIONS);
  }
  */

  initQuestions() {
    this.questions = new Array();
    for(let i = 0; i < this.questions.length; i++) {
      this.questions[i] = new Array();
    }
    let request = this.http.get(this.questionUrl);
    request.subscribe(questions => {this.questions = (<any[][]>questions);});
  }

  getQuestions() {
    return this.questions;
  }

  calTotalQuestions(part: number): number {
    let total: number = 0;
    let start: number = (part == 5) ? 0 : 3;
    for(let j = start; j < this.questions.length; j++) {
      for(let i = 0; i < this.questions[((part == 5) ? j + 1: part) - 1].length; i++) {
        total++;
      }
    }
    return total;
  }

  updateQuestion(question: any, part: number) {

    this.http.post(this.questionUrl, {question, part}, this.httpOptions).subscribe(success => {});
  }

  addQuestion(question: any, part: number) {
    this.questions[part - 1].push(question);
    this.http.post(this.questionUrl, {question, part}, this.httpOptions).subscribe(success => {});
  }

  deleteQuestion(question: any, part: number) {
    this.http.post(this.questionUrl, {question: question, part: part, type: 'delete'}, this.httpOptions).subscribe(() => {this.initQuestions()});
  }


  getSection(progress: number): number {
    if(progress <= this.questions[0].length) {
      return 1;
    } else if(progress <= (this.questions[0].length + this.questions[1].length)) {
      return 2;
    } else if(progress <= (this.questions[0].length + this.questions[1].length + this.questions[2].length)) {
      return 3;
    } else {
      return 4;
    }
  }

  getQuestion(progress: number): number {
    let section = this.getSection(progress);
    let rmAmount = 0;
    for(let i = 1; i < section; i++) {
      rmAmount += this.questions[i - 1].length;
    }
    return progress - rmAmount;
  }

  getProgressPercent(progress: number): number {
    let section = this.getSection(progress);
    let question = this.getQuestion(progress);
    return ((section - 1) * 25) + ((25 / this.questions[section - 1].length) * (question));
  }

  calProgress(part: number, question: any): number {
    let progress = 0;
    for(let i = 1; i < part; i++) {
      progress += this.questions[i - 1].length;
      //(progress);
    }
    progress += parseInt(question);
    //(progress);
    return progress;
  }
}
