import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Student } from './student';
import { QuestionService } from './question.service';

interface ICallback {
  (error: string, success: boolean) : void;
}

interface LoginCallback {
  (error: string, success: boolean, student: Student) : void;
}

interface InStudent {
  id: number;
  user: string;
  success: number;
  error: string;
}


@Injectable()
export class StudentsService {

  studentUrl: string = '/frenchFSL/requestStudents.php/';
  studentTimeUrl: string = '/frenchFSL/upStudentTime.php/';
  studentLoginUrl: string = '/frenchFSL/login.php/';
  // studentUrl: string = 'https://www3.laurentian.ca/angular/french-test/src/requestStudents.php/';
  // studentTimeUrl: string = 'https://www3.laurentian.ca/angular/french-test/src/upStudentTime.php/';
  // studentLoginUrl: string = 'https://www3.laurentian.ca/angular/french-test/src/login.php';

  students: Student[] = new Array();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    })
  }


  constructor(private http: HttpClient, private questionService: QuestionService) { }

  initStudents() {
    this.http.get(this.studentUrl).subscribe(students => {
      this.students = new Array();
      for(let i = 0; i < (<Student[]>students).length; i++) {
        let temp: Student;
        temp = <Student>students[i];
        this.students.push(temp);
      }
    });
  }

  getStudent(studentID: number): Student {
    let temp: Student;
    this.students.forEach(student => {
      if(student.studentID == studentID) {
        temp = student;
      }
    });
    return temp;


  }

  getStudents() {
    return this.students;
  }

  newStudent(student: Student, callback: ICallback): void {
    this.students.push(student);
    let totalQ = this.questionService.calTotalQuestions(5);
    this.http.post(this.studentUrl, {totalQuestion: totalQ ,student: student}, this.httpOptions).subscribe(success => {if(success['success'] == 2) this.students.pop();callback(success['error'], success['success']); console.log(success);});
  }

  updateStudent(student: Student) {
    let totalQ = this.questionService.calTotalQuestions(5);
    this.http.post(this.studentUrl,{totalQuestion: totalQ ,student: student}, this.httpOptions).subscribe(success => {});
  }

  updateStudentTime(student: Student) {
    this.http.post(this.studentTimeUrl, student, this.httpOptions).subscribe(data => {});
  }

  updateStudentAdmin(student: Student) {
    this.http.post(this.studentUrl, {student: student, type: 'admin'}, this.httpOptions).subscribe(() => {this.initStudents()});
  }

  deleteStudent(student: Student) {
    this.http.post(this.studentUrl, {student: student, type: 'delete'}, this.httpOptions).subscribe(() => {this.initStudents()});
  }

  loginStudent(id: string, pass: string, callback: LoginCallback) {
    this.http.post(this.studentLoginUrl, {id: id, pass: pass}, this.httpOptions).subscribe((student: InStudent) => {
      let temp:Student = new Student();
      temp.name = student.user;
      temp.studentID = student.id;
      temp.email = student.user + "@laurentian.ca";
      console.log(student);
      console.log(student.success == 1);
      if(student.success == 1) {
        callback("", student.success == 1, temp);
      } else {
        callback(student.error, student.success == 1, null);
      }
    });
  }
}
